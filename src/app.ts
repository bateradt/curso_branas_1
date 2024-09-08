import express from "express";
import { SignupService } from "./services/signupService";
import { AccountRepository } from "./repositories/accountRepository";
import signupController from "./controllers/signupController";

const app = express();
app.use(express.json());
const accountRepository = new AccountRepository();
const signupService = new SignupService(accountRepository);
app.use(signupController(signupService));

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});