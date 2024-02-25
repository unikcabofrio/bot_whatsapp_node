export const createdTestIPTV = async (chatClient, data, dataResponse) => {
    const { dns, username, password, expiresAtFormatted, payUrl } = dataResponse;
    const newData = {
        testeIPTV: true,
        username,
        password,
        dns,
        expiresAtFormatted,
        payUrl
    };

    const textSend = `✅ Seu usuário foi criado com sucesso!\n\n👤 Usuário: ${username}\n🔏 Senha: ${password}\n🌐 Host: ${dns}\n\n🗓️ Vencimento: ${expiresAtFormatted}\n💳 Assinar/Renovar Plano: ${payUrl}\n\nPara poder estar utilizando a sua conta, recomendamos que faça a instalação de alguns desses aplicativos:\n\n🟢 WebPlayer: ${process.env.WEB_PLAYER}\n🟢 Play Ghost: ${process.env.APK_GHOST}\n🟢 Xtream Player: ${process.env.APK_XTREAM}\n\nCaso tenha alguma dúvida, digite *4* para entrar em contato com o suporte`;

    await chatClient.sendMessage(textSend, data._serialized);
    return newData;
};
