import { IAccountRepository } from "../interfaces/iaccountRepository";
import { Account } from "../models/account";

export class MockAccountRepository implements IAccountRepository {
    private accounts: Account[] = [];

    async findByEmail(email: string): Promise<Account | null> {
        const account = this.accounts.find(account => account.email === email);
        return account || null;
    }

    async createAccount(account: Account): Promise<void> {
        this.accounts.push(account);
    }

    async findByID(id: string): Promise<Account | null> {
        const account = this.accounts.find(account => account.account_id === id);
        return account || null;
    }
}