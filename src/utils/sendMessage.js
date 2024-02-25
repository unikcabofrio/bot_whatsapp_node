import { list, save, update } from '../database/proxy.js';
import { greetingMessage } from '../utils/greetingMessage.js';
import { createdTestIPTV } from '../utils/createdTestIPTV.js';

const COMMAND_TEST_ADULT = '1';
const COMMAND_TEST_NON_ADULT = '2';
const COMMAND_LEARN_IPTV = '3';
const COMMAND_SUPPORT = '4';

const sendTestResponse = async (client, chatClient, data, testUrl) => {
    const response = await fetch(testUrl, { method: 'post' });
    if (response.status === 200) {
        const dataResponse = await response.json();
        await createdTestIPTV(chatClient, data, dataResponse)
            .then(async (resultData) => {
                await update(data._serialized, resultData);
            });
    }
};

export const clientMessage = async (client, chatClient, data) => {
    let textSend;
    const result = await list(data._serialized, '_serialized');
    const greeting = greetingMessage();

    if (result.length === 0) {
        textSend = `Olá ${data.pushname}, ${greeting}\n\nO que acha de fazer um *teste IPTV* sem compromisso *totalmente Grátis*? 😊😉\n\nTenho algumas opções que você pode escolher, basta digitar o número.\n\n*1* - Teste com canais Adultos\n*2* - Teste sem canais Adultos\n*3* - Saber mais sobre IPTV\n*4* - Falar com suporte`;

        await chatClient.sendMessage(textSend, data._serialized)
            .then(async () => {
                await save({
                    _serialized: data._serialized,
                    testeIPTV: false,
                    suport: false,
                });
            });
    } else {
        if (result[0].suport) {
            const contatoSup = process.env.CONTATOSUP + '@c.us';
            await client.sendMessage(contatoSup, `Cliente:${data._serialized}\nMensagem: ${data.ClientMsg}`);
        } else {
            switch (data.ClientMsg) {
                case COMMAND_TEST_ADULT:
                case COMMAND_TEST_NON_ADULT:
                    if (!result[0].testeIPTV) {
                        const testUrl = (data.ClientMsg === COMMAND_TEST_ADULT) ? process.env.TEST_C_ADULT : process.env.TEST_S_ADULT;
                        await sendTestResponse(client, chatClient, data, testUrl);
                    } else {
                        const { expiresAtFormatted, payUrl } = result[0];
                        textSend = `Oi ${data.pushname}, Segue as informações para a renovação do seu plano\n\n🗓️ Vencimento: ${expiresAtFormatted}\n💳 Assinar/Renovar Plano: ${payUrl}\n\nCaso tenha alguma dúvida digite *4* para entrar em contato com o suporte`;
                        await chatClient.sendMessage(textSend, data._serialized);
                    }
                    break;

                case COMMAND_LEARN_IPTV:
                    textSend = `Com o IPTV, é possível assistir através de televisões, computadores, tablets e smartphones, desde que estejam conectados à Internet.😁😊\nO IPTV oferece algumas vantagens, como a capacidade de escolher quando e o que assistir, além de fornecer opções interativas, como pausar, retroceder e avançar o conteúdo💖\n\nPara saber mais sobre quais vantagens você terá acesse\nhttps://unikcfiptv.vercel.app/`;
                    await chatClient.sendMessage(textSend, data._serialized);
                    break;

                case COMMAND_SUPPORT:
                    textSend = `${data.pushname}, Enviamos sua solicitação para o suporte,😊 ele estará entrando em contato em breve, aguarde alguns minutos.😉`;
                    const contatoSup = process.env.CONTATOSUP + '@c.us';
                    await client.sendMessage(contatoSup, `*⚠ SUPORTE*\nCliente ${data._serialized}\nEstá com problemas técnicos, por favor, entre em contato o mais rápido possível.`)
                        .then(async () => {
                            await update(data._serialized, { suport: true });
                            await chatClient.sendMessage(textSend, data._serialized);
                        });
                    break;

                default:
                    textSend = `Olá ${data.pushname}, ${greeting}\n\nFico feliz que esteja entrando em contato. 😁😊\nComo posso estar te ajudando hoje?\n\nTenho algumas opções que você pode escolher, basta digitar o número.\n`;

                    if (!result[0].testeIPTV) {
                        textSend += `\n*1* - Fazer teste com canais Adultos\n*2* - Fazer teste sem canais Adultos`;
                    } else {
                        textSend += `\n*1* - Renovar Plano\n*2* - Ver Usuário e Senha`;
                    }

                    textSend += `\n*3* - Saber mais sobre IPTV\n*4* - Falar com suporte`;

                    await chatClient.sendMessage(textSend, data._serialized);
                    break;
            }
        }
    }
};
