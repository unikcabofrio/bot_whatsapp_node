// import msgJson from '../json/messages.json' with { "type": "json" }
import { list, save, update } from '../database/proxy.js'
import { greetingMessage } from '../utils/greetingMessage.js'
import { createdTestIPTV } from '../utils/createdTestIPTV.js'

export const clientMessage = async (client, chatClient, data) => {

    let TextSend
    const result = await list(data._serialized, '_serialized')
    const greeting = greetingMessage()

    // CLIENTE SEM CADASTRADO
    if (result.length === 0) {
        TextSend = `Olá ${data.pushname}, ${greeting}`
            + `\n`
            + `\nO que acha de fazer um *teste IPTV* sem compromisso *totalmente Grátis*? 😊😉`
            + `\n`
            + `\nTenho algumas opções que você pode escolher, basta digitar o número.`
            + `\n`
            + `\n*1* - Teste com canas Adultos`
            + `\n*2* - Teste sem canas Adultos`
            + `\n*3* - Sáber mais sobre IPTV`
            + `\n*4* - Falar com suporte`

        await chatClient.sendMessage(TextSend, data._serialized)
            .then(async () => {
                await save({
                    _serialized: data._serialized,
                    testeIPTV: false,
                    suport: false,
                })
            })

    }

    // CLIENTE CADASTRO
    else {

        // CLIENTE ESTA EM MODO SUPORTE
        if (result[0].suport) {
            const contatoSup = process.env.CONTATOSUP + '@c.us'
            await client.sendMessage(contatoSup, `Cliente:${data._serialized}\nMensagem: ${data.ClientMsg}`)
        }

        // CLIENTE NÃO ESTA EM MODO SUPORTE AS MSG CORREM NORMAL
        else {
            switch (data.ClientMsg) {

                case '1':
                    if (!result[0].testeIPTV) {
                        const response = await fetch(process.env.TEST_C_ADULT, { method: "post" });
                        if (response.status === 200) {
                            const dataResponse = await response.json();
                            await createdTestIPTV(chatClient, data, dataResponse)
                                .then(async (resultData) => {
                                    await update(data._serialized, resultData)
                                })
                        }

                    } else {
                        const { expiresAtFormatted, payUrl } = result[0]
                        TextSend = `Oi ${data.pushname}, Segue as informações para a renovação do seu plano`
                            + `\n`
                            + `\n🗓️ Vencimento: ${expiresAtFormatted}`
                            + `\n💳 Assinar/Renovar Plano: ${payUrl}`
                            + `\n`
                            + `\nCaso tenha alguma duvida digite *4* para entrar em contato com o suporte`

                        await chatClient.sendMessage(TextSend, data._serialized)
                    }
                    break;

                case '2':
                    if (!result[0].testeIPTV) {
                        const response = await fetch(process.env.TEST_S_ADULT, { method: "post" });
                        if (response.status === 200) {
                            const dataResponse = await response.json();
                            await createdTestIPTV(chatClient, data, dataResponse)
                                .then(async (resultData) => {
                                    await update(data._serialized, resultData)
                                })
                        }

                    } else {
                        const { username, password, dns } = result[0]
                        TextSend = `Oi ${data.pushname}, Segue as informações sobre sua conta`
                            + `\n`
                            + `\n👤 Usuário: ${username}`
                            + `\n🔏 Senha: ${password}`
                            + `\n🌐 Host: ${dns}`
                            + `\n`
                            + `\nPara poder está utilizando a sua conta, recomendamos que faça a instalação de alguns desses aplicativos:`
                            + `\n`
                            + `\n🟢 WebPlayer: ${process.env.WEB_PLAYER}`
                            + `\n🟢 Play Ghost: ${process.env.APK_GHOST}`
                            + `\n🟢 Xtream Player: ${process.env.APK_XTREAM}`
                            + `\n`
                            + `\nCaso tenha alguma duvida digite *4* para entrar em contato com o suporte`

                        await chatClient.sendMessage(TextSend, data._serialized)
                    }
                    break;

                case '3':
                    TextSend = `Com o IPTV, É possível assistir através de televisões, computadores, tablets e smartphones, desde que estejam conectados à Internet.😁😊`
                        + `\nO IPTV oferece algumas vantagens, como a capacidade de escolher quando e o que assistir, além de fornecer opções interativas,`
                        + `como pausar, retroceder e avançar o conteúdo💖`
                        + `\n\nPara saber mais sobre quais vantagens você terá acesse`
                        + `\nhttps://unikcfiptv.vercel.app/`

                    await chatClient.sendMessage(TextSend, data._serialized)
                    break;

                case '4':
                    TextSend = `${data.pushname}, Enviamos sua solicitação para o suporte,😊 ele estará entrando em contato em breve, aguarde alguns mínutos.😉`
                    const contatoSup = process.env.CONTATOSUP + '@c.us'

                    const newData = {
                        _serialized: data._serialized,
                        testeIPTV: result[0].testeIPTV,
                        suport: true,
                        username: result[0].username,
                        password: result[0].password,
                        dns: result[0].dns,
                        expiresAtFormatted: result[0].expiresAtFormatted,
                        payUrl: result[0].payUrl,
                    }

                    await client.sendMessage(contatoSup, `*⚠ SUPORTE*\nCliente ${data.number}\nEstá com programas técnicos, por favor entre em contato o mais rápido`)
                        .then(async () => {
                            await update(data._serialized, newData)
                            await chatClient.sendMessage(TextSend, data._serialized)
                        })
                    break;

                default:
                    TextSend = `Olá ${data.pushname}, ${greeting}`
                        + `\n`
                        + `\nFico feliz que esteja entrando em contato. 😁😊`
                        + `\nComo posso está te ajudando hoje?`
                        + `\n`
                        + `\nTenho algumas opções que você pode escolher, basta digitar o número.`
                        + `\n`

                    // SE O CLIENTE NUNCA FEZ UM TESTE INFORMAR QUE ELE PODE FAZER
                    if (!result[0].testeIPTV) {
                        TextSend += `\n*1* - Fazer teste com canas Adultos`
                            + `\n*2* - Fazer teste sem canas Adultos`
                    } else {
                        // SE ELE JÁ FE UM TESTE PASSAR OUTRA INFORMAÇÕES
                        TextSend += `\n*1* - Renovar Plano`
                            + `\n*2* - Ver Usuário e Senha`
                    }

                    TextSend += `\n*3* - Sáber mais sobre IPTV`
                        + `\n*4* - Falar com suporte`


                    await chatClient.sendMessage(TextSend, data._serialized)
                    break;
            }
        }


    }

}