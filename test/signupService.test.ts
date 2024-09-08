import { SignupService } from "../src/services/signupService";
import { MockAccountRepository } from "../src/mocks/mockAccountRepository";
import { EmailExistsError } from "../src/errors/emailExistsError";
import { BadRequestError } from "../src/errors/badRequestError";

describe("SignupService", () => {
    let signupService: SignupService;
    let mockAccountRepository: MockAccountRepository;

    beforeEach(() => {
        mockAccountRepository = new MockAccountRepository();
        signupService = new SignupService(mockAccountRepository);
    });

    it("Should create a new account", async() => {
        const inputData = {
            name: "Marcelo Scarpim",
            email: "marcelo@teste.com",
            cpf: "73373760224",
            carPlate: "ABC1234",
            isPassenger: true,
            isDriver: false,
            password: "123456"
        }

        const accountID = await signupService.signup(inputData);
        expect(accountID).toBeTruthy();

    });

    it("Should not create a new account if email already exists", async() => {
        const inputData = {
            name: "Marcelo Scarpim",
            email: "marcelo@teste.com",
            cpf: "73373760224",
            carPlate: "ABC1234",
            isPassenger: true,
            isDriver: false,
            password: "123456" 
        }

        await signupService.signup(inputData);
        await expect(signupService.signup(inputData)).rejects.toThrow(EmailExistsError);
    });

    it("Should return bad request when name is invalid", async() => {
        const inputData = {
            name: "Marcelo",
            email: "marcelo1@teste.com",
            cpf: "73373760224",
            carPlate: "ABC1234",
            isPassenger: true,
            isDriver: false,
            password: "123456" 
        }
        await expect(signupService.signup(inputData)).rejects.toThrow(BadRequestError);
    });

    it("Should return bad request when email is invalid", async() => {
        const inputData = {
            name: "Marcelo Scarpim",
            email: "marcelo",
            cpf: "73373760224",
            carPlate: "ABC1234",
            isPassenger: true,
            isDriver: false,
            password: "123456" 
        }
        await expect(signupService.signup(inputData)).rejects.toThrow(BadRequestError);
    });

    it("Should return bad request when car plate is invalid", async() => {
        const inputData = {
            name: "Marcelo Scarpim",
            email: "marcelo@te.com",
            cpf: "73373760224",
            carPlate: "12",
            isPassenger: false,
            isDriver: true,
            password: "123456" 
        }
        await expect(signupService.signup(inputData)).rejects.toThrow(BadRequestError);
    });

    it("Should return bad request when cpf is invalid", async() => {
        const inputData = {
            name: "Marcelo Scarpim",
            email: "marcelo@te.com",
            cpf: "1234567890",
            carPlate: "ABC1234",
            isPassenger: false,
            isDriver: true,
            password: "123456" 
        }
        await expect(signupService.signup(inputData)).rejects.toThrow(BadRequestError);
    });

    it("Should find a account by id", async() => {
        const inputData = {
            name: "Marcelo Scarpim",
            email: "marcelo@teste.com",
            cpf: "73373760224",
            carPlate: "ABC1234",
            isPassenger: true,
            isDriver: false,
            password: "123456"
        }

        const accountID = await signupService.signup(inputData);
        expect(accountID).toBeTruthy();
        if (accountID) {
            const account = await signupService.findAccountById(accountID);
            expect(account).toBeTruthy();
        } else {
            fail("Account ID is not valid");
        }
    });

    it("Should find a account by id", async() => {
        const id = "";

        await expect(signupService.findAccountById(id)).rejects.toThrow(BadRequestError);
    });

});