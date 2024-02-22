import msgJson from '../json/messages.json' with { "type": "json" }
import {ListClients} from '../database/proxy.js'

export const sendMessageChat = async (client,message) => {

    try {
        let chatMSg
        let user = await message.getContact();
        let number = user.number
        let pushname = user.pushname
        const id = message.id['id']
        const msg = message.body

        // Verificar se a pessoa já fez o teste de 6 horas ou não
        const data = await ListClients(number)

        // Caso ele não tenha feito o teste ainda ele vai esta aqui
        if(data.length === 0){

            // Teste C/canais Adultos
            if(msg === '1'){

                const response = await fetch('https://painelplayghost.online/api/chatbot/Yen12zv1PE/XKjLMRD04p', {
                    method: "post"
                });
                const responseJson = await response.json();

                await client.sendMessage(message.from,responseJson.reply )
            }

            // Teste S/canais Adultos
            else if(msg === '2'){
                const response = await fetch('https://painelplayghost.online/api/chatbot/Yen12zv1PE/64vLbNLgGn', {
                    method: "post"
                });
                const responseJson = await response.json();

                await client.sendMessage(message.from,responseJson.reply )
            }

            // enviando mensagem para o suporte
            else if(msg === '3'){
                await client.sendMessage('5522992726827@c.us',`*Suporte*\n\nO cliente que falar com você\nContato: ${number}`);
            }

            // mensagem de boas vindas
            else{
                chatMSg = `Olá ${pushname}, ${msgJson['boasvindas']}\n\n${msgJson['opInicial']}`
                await client.sendMessage(message.from,chatMSg )
            }
        }
        
        // Caso ele tenha feito o teste
        else{
           

        }
    } catch (error) {
        console.error(`ERRO [ sendMessageChat ] : ${error.message}`)
    }
}

export const sendMessageGroup = (client) => {
    console.log(client)
}