export const normalizePhoneNumber = (number: string): number => {
    const cleanedNumber = number.replace(/\D/g, "");
    if (cleanedNumber.length === 10) {
        return parseInt(cleanedNumber);
    } else if (cleanedNumber.length > 10) {
        return parseInt(cleanedNumber.slice(-10));
    } else {
        console.warn("Invalid phone number:", number);
        return 0;
    }
};
