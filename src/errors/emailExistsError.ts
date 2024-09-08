export class EmailExistsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmailExistsError';
    }
}