import {Request, Response } from "express";
import { observablepedro } from "../entity/observablepedro";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";

export class RPAController {

    static status = async (request: Request, response: Response) => {
        const rpaRepository = AppDataSource.getRepository(observablepedro);
        let report:observablepedro[];
        try{
            report = await rpaRepository.find();
            report[0].STATUS = 1;
        }catch(e){
            response.status(404).json({ message: 'Database integrity error.'});
        }
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(report,validationOpt);
        
        if(errors.length > 0){
            return response.status(400).json({message: 'Database integrity error'});
        }

        try{
            await rpaRepository.update(0,report[0]);
        }catch(e){
            return response.status(409).json({menssage: 'Unknown error, contact your administrator.'})
        }
        return response.status(201).json({message: 'Reported changes to Pedro RPA.'});
    };

    }