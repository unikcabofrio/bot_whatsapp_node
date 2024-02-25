import qrcode from 'qrcode-terminal';
import { clientMessage } from '../utils/sendMessage.js';
import { SupMessage } from '../utils/sendMessageSup.js';
import pkg from 'whatsapp-web.js';

const { Client, LocalAuth } = pkg;
const contatoSup = process.env.CONTATOSUP + '@c.us';

export const client = new Client({ authStrategy: new LocalAuth() });

// QR CODE PARA CONEXÃO
client.on('qr', (qr) => {
    console.log('[ NODE - WZAP] - Scan the QR code to validate WhatsApp');
    qrcode.generate(qr, { small: true });
});

// VERIFICANDO SE O QRCODE FOI ESCANEADO
client.on('ready', () => {
    console.log('[ NODE - WZAP] - Customer successfully connected!\n');
});

// ESCUTANDO TODAS AS MSG
client.on('message', async (message) => {
    const contactClient = await message.getContact();
    const chatClient = await message.getChat();

    if (contactClient.id._serialized === contatoSup) {
        SupMessage(client, contatoSup, message);
    } else {
        if (contactClient.isUser) {
            const { number, pushname } = contactClient;
            const { body } = message;
            const { _serialized } = contactClient.id;

            const data = {
                ClientMsg: body,
                number,
                pushname,
                _serialized
            };

            clientMessage(client, chatClient, data);
            console.log(`[ NODE - WZAP] (message)- ${number}`);
        }
    }
});
