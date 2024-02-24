import qrcode from 'qrcode-terminal'
import {clientMessage} from '../utils/sendMessage.js';

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
    console.log('[ NODE - WZAP] - Customer successfully connected!\n');
})

// ESCUTANDO TODAS AS MSG
client.on('message', async (message) => {

    const contactClient = await message.getContact()
    const chatClient = await message.getChat();

    const contatoSup = process.env.CONTATOSUP + '@c.us'
    if(contactClient.id._serialized === contatoSup){
        const msgSuport = message.body.split('\n')
        console.log(msgSuport)
    } else{
        // if(contactClient.isUser){

        //     const ClientMsg = message.body
        //     const {number,pushname} = contactClient
        //     const {_serialized} = contactClient.id
    
        //     const data = {
        //         ClientMsg,
        //         number,
        //         pushname,
        //         _serialized
        //     }
    
        //     clientMessage(client,chatClient,data)
        //     console.log(`[ NODE - WZAP] (message)- ${number}`);
        // }
    }


    
    
})