export const greetingMessage = () => {
    let h = new Date().toLocaleTimeString('pt-BR', {hour: 'numeric', hour12: false}); 

    if(h >= 0 && h < 6){
        return 'Boa noite';
    } else if(h >= 6 && h < 12){
        return 'Bom Dia';
    } else if(h >= 12 && h < 18){
        return 'Boa Tarde';
    } else{
        return 'Boa noite';
    }
}