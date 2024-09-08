import { BadRequestError } from "../errors/badRequestError";
import {Account } from "../models/account";

export interface ISignupService {
    signup(input: any): Promise<string | null>;
    findAccountById(id: string): Promise<Account | null>;
}