import express from 'express';
import signupController from '../src/controllers/signupController';
import { ISignupService } from '../src/interfaces/isignupService';
import { EmailExistsError } from '../src/errors/emailExistsError';
import request from 'supertest';

describe('signupController', () => {
    let app: express.Application;
    let mockSignupService: jest.Mocked<ISignupService>;

    beforeEach(() => {
        mockSignupService = {
            signup: jest.fn(),
            findAccountById: jest.fn()
        };
        app = express();
        app.use(express.json());
        app.use(signupController(mockSignupService));
    });

    describe('POST /signup', () => {
        it('should return 201 and accountID when signup is successful', async () => {
            const accountID = '12345';
            mockSignupService.signup.mockResolvedValue(accountID);

            const response = await request(app)
                .post('/signup')
                .send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ accountID });
        });

        it('should return 400 when signup fails', async () => {
            mockSignupService.signup.mockResolvedValue(null);

            const response = await request(app)
                .post('/signup')
                .send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(400);
        });

        it('should return 409 when email already exists', async () => {
            mockSignupService.signup.mockRejectedValue(new EmailExistsError('Email already exists'));

            const response = await request(app)
                .post('/signup')
                .send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(409);
            expect(response.body).toEqual({ message: 'Email already exists' });
        });

        it('should return 500 for other errors', async () => {
            mockSignupService.signup.mockRejectedValue(new Error('Internal Server Error'));

            const response = await request(app)
                .post('/signup')
                .send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(500);
            console.log(response.body);
            expect(response.body).toEqual({ message: {} });
        });
    });

    describe('GET /user/:id', () => {
        it('should return 200 and account when account is found', async () => {
            const account = { 
                account_id: "1234567890",
                name: "Marcelo Scarpim",
                email: "marcelo@teste.com",
                cpf: "73373760224",
                car_plate: "ABC1234",
                is_passenger: true,
                is_driver: false,
                password: "123456" };
            mockSignupService.findAccountById.mockResolvedValue(account);

            const response = await request(app).get('/user/12345');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(account);
        });

        it('should return 404 when account is not found', async () => {
            mockSignupService.findAccountById.mockResolvedValue(null);

            const response = await request(app).get('/user/12345');

            expect(response.status).toBe(404);
        });
    });
});