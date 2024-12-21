import { Request,Response } from "express";
import Airtime from "../database/models/AirtimeModel";

const API_URL= process.env.VTU_AIRTIME_API;
const VTU_APIKEY = process.env.VTU_APIKEY;


const AirtimeRecharge = async (req:Request, res:Response) => {
    const { network, phone, amount, ref, userId } = req.body;
        if (!network || !phone || !amount || !ref) {
            return res.status(400).json({ message: "All fields are required." });
        }


    try {

        const airtimeTransaction = new Airtime({
            network,
            phone,
            amount,
            ref,
            userId
        })
        await airtimeTransaction.save()


        const response = await axios.post(API_URL,{
            apiKey: VTU_APIKEY,
            network,
            phone,
            amount,
            ref,
            userId
        })
        airtimeTransaction.status = "success";
        await airtimeTransaction.save();
        return res.status(200).json({
            success: true,
            data: response.data,
            airtimeTransaction,
          });
    } catch (error) {
        res.status(500).json({ message: "Error saving gift card", error });

    }
}

export default {AirtimeRecharge}