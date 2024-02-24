export const createdTestIPTV = async (chatClient, data, dataResponse) => {
    const { dns, username, password, expiresAtFormatted, payUrl } = dataResponse
    const newData = {
        _serialized: data._serialized,
        testeIPTV: true,
        suport: false,
        username: username,
        password: password,
        dns: dns,
        expiresAtFormatted: expiresAtFormatted,
        payUrl: payUrl
    }

    let TextSend = `✅ Seu usuário foi criado com sucesso!`
        + `\n`
        + `\n👤 Usuário: ${username}`
        + `\n🔏 Senha: ${password}`
        + `\n🌐 Host: ${dns}`
        + `\n`
        + `\n🗓️ Vencimento: ${expiresAtFormatted}`
        + `\n💳 Assinar/Renovar Plano: ${payUrl}`
        + `\n`
        + `\nPara poder está utilizando a sua conta, recomendamos que faça a instalação de alguns desses aplicativos:`
        + `\n`
        + `\n🟢 WebPlayer: ${process.env.WEB_PLAYER}`
        + `\n🟢 Play Ghost: ${process.env.APK_GHOST}`
        + `\n🟢 Xtream Player: ${process.env.APK_XTREAM}`
        + `\n`
        + `\nCaso tenha alguma duvida digite *4* para entrar em contato com o suporte`

    await chatClient.sendMessage(TextSend, data._serialized)
    return newData
}