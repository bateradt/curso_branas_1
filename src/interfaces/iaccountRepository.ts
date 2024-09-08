import { Account } from "../models/account";

export interface IAccountRepository {
    findByEmail(email: string): Promise<Account | null>;
    createAccount(account: Account): Promise<void>;
    findByID(id: string): Promise<Account | null>;
}