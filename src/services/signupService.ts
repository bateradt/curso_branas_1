import crypto from 'crypto';
import { validateCpf } from '../utils/validateCpf';
import { Account } from '../models/account';
import { ISignupService } from '../interfaces/isignupService';
import { IAccountRepository } from '../interfaces/iaccountRepository';
import { EmailExistsError } from '../errors/emailExistsError';
import { BadRequestError } from '../errors/badRequestError';
//import { validate as isUuid } from 'uuid';

export class SignupService implements ISignupService {
    private accountRepository: IAccountRepository;

    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository;
    }

    async signup(input: any) : Promise<string | null> {
        if (!input.email.match(/^(.+)@(.+)$/)) {
            throw new BadRequestError('Invalid email');
        }
        if (!validateCpf(input.cpf)) {
            throw new BadRequestError('Invalid CPF');
        }
        if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
            throw new BadRequestError('Invalid name');
        }
        if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
            throw new BadRequestError('Invalid car plate');
        }
        const account = await this.accountRepository.findByEmail(input.email);
        if (account) {
            throw new EmailExistsError(`Email ${input.email} already exists`);
        }

        const accountID = crypto.randomUUID();
        await this.accountRepository.createAccount({
            account_id: accountID,
            name: input.name,
            email: input.email,
            cpf: input.cpf,
            car_plate: input.carPlate,
            is_passenger: !!input.isPassenger,
            is_driver: !!input.isDriver,
            password: input.password
        });

        return accountID;
    }

    async findAccountById(id: string) : Promise<Account | null > {
        if (id.length !== 36) {
            throw new BadRequestError('Invalid id');
        }
        return await this.accountRepository.findByID(id);
    }

}