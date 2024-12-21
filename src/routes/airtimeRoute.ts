import express from "express";
import { NextFunction, Request, Response } from "express";
import AirtimeController from "../controllers/AirtimeController";

const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const airtimeRoute = express.Router();

airtimeRoute.post("/register", catchAsync(AirtimeController.AirtimeRecharge));


export default airtimeRoute;
