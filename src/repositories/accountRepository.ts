import pgp from "pg-promise";
import dotenv from "dotenv";
import { Account } from "../models/account";
import { IAccountRepository } from "../interfaces/iaccountRepository";

dotenv.config();

export class AccountRepository implements IAccountRepository { 
    private db: any;

    constructor() {
        this.db = pgp()(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/app");        
    }

    async findByEmail(email: string): Promise<Account | null> {
        const [account] = await this.db.query("select * from ccca.account where email = $1", [email]);
        return account || null;
    }

    async createAccount(account: Account) {
        await this.db.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver, account.password]);
    }

    async findByID(id: string): Promise<Account | null> {
        const [account] = await this.db.query("select * from ccca.account where account_id = $1", [id]);
        return account || null;
    }
}