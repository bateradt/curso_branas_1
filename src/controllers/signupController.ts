import express from "express";
import { ISignupService } from "../interfaces/isignupService";
import { EmailExistsError } from "../errors/emailExistsError";

export default (signupService: ISignupService) => {
    const signupController = express.Router();

    signupController.post("/signup", async(req, res) => {
        const input = req.body;
        try {
            const accountID = await signupService.signup(input);
            if (!accountID) {
                return res.sendStatus(400);
            }
            return res.status(201).send({ accountID });
        } catch (error) {
            if (error instanceof EmailExistsError) {
                res.status(409).send({ message: error.message });
            } else {
                res.status(500).send({ message: error });
            }
        }
    });

    signupController.get("/user/:id", async(req, res) => {
        const { id } = req.params;
        const account = await signupService.findAccountById(id);
        if (!account) {
            return res.sendStatus(404);
        }
        return res.send(account);
    });

    return signupController
};
