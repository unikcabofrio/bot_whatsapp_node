export const greetingMessage = () => {
    const hour = new Date().getHours();

    if (hour >= 0 && hour < 6) {
        return 'Boa noite';
    } else if (hour >= 6 && hour < 12) {
        return 'Bom Dia';
    } else if (hour >= 12 && hour < 18) {
        return 'Boa Tarde';
    } else {
        return 'Boa noite';
    }
};
