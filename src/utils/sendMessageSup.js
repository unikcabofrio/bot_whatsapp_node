import { listSup, list, update } from '../database/proxy.js';

const COMMAND_CLOSE_SUPPORT = '!fechar';
const COMMAND_LIST_SUPPORT = '!listar';
const COMMAND_ACCEPT_SUPPORT = '!aceita';

const sendMessageToClient = async (client, contact, message) => {
    await client.sendMessage(contact, message);
};

export const SupMessage = async (client, contatoSup, message) => {
    const msgSuport = message.body;
    let result;
    let textSend;

    const [supClient] = await list(contatoSup, '_serialized');

    if (supClient.supClient) {
        switch (msgSuport) {
            case COMMAND_CLOSE_SUPPORT:
                await sendMessageToClient(client, supClient.supClient, `⚠ Chamada de Suporte encerrada.`);
                await update(contatoSup, { supClient: '' });
                break;
            default:
                await sendMessageToClient(client, supClient.supClient, `Suporte: *Rayan*\n${msgSuport}`);
                break;
        }
    } else {
        if (msgSuport.includes(COMMAND_LIST_SUPPORT)) {
            result = await listSup();
            textSend = `Lista de clientes com suporte *ativo*:\n`;
            for (let i = 0; i < result.length; i++) {
                textSend += `*${i}* - ${result[i]}\n`;
            }
            await sendMessageToClient(client, contatoSup, textSend);
        } else if (msgSuport.includes(COMMAND_ACCEPT_SUPPORT)) {
            const sArray = msgSuport.split('\n');
            result = await listSup();
            await update(result[sArray[1]], { suport: false });
            await update(contatoSup, { supClient: result[sArray[1]] });
            await sendMessageToClient(client, result[sArray[1]], `🟢 O Suporte *Rayan* Aceitou sua chamada.`);
        }
    }
};
