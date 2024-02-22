import qrcode from 'qrcode-terminal'

import {sendMessageChat} from '../utils/sendMessage.js';

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;



export const client = new Client({ authStrategy: new LocalAuth() });

// QR CODE PARA CONEXÃO
client.on('qr', (qr) => {
    console.log('[ NODE - WZAP] - Scan the qrcode to validate whatsapp');
    qrcode.generate(qr, { small: true });
});

// VERIFICANDO SE O QRCODE FOI ESCANECADO
client.on('ready', () => {
    console.log('[ NODE - WZAP] - Customer successfully connected!');
})

// ESCUTANDO TODAS AS MSG
client.on('message', async (message) => {

    // VERIFICAR SE QUEM MANDOU A MSG FOI ATRAVÉS DE UM CHAT PESSOAL
    if (message.type === 'chat') {
        sendMessageChat(client,message)
    }
})