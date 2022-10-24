import { Request, Response } from "express";
import { Restore } from "../entity/Restore";
import { AppDataSource } from "../data-source";
import { validate} from "class-validator";
import { RestoreData } from "../interface/restore";

export class RestoreController {
    static getAll = async (request: Request, response: Response) => {
        const restoreRepository = AppDataSource.getRepository(Restore);
        let restores: RestoreData[];
        try{
            restores = await restoreRepository.query("CALL restore_data()");
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(restores.length > 0){
            response.send(restores[0]);
            
        }else{
            response.status(404).json({message: 'You have no records registered so far.'});
        }
    }

    static save = async (request: Request, response: Response) => {
        
        const restoreRepository = AppDataSource.getRepository(Restore);
        
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(request.body,validationOpt);

        if(errors.length > 0){
            return response.status(400).json({message: 'Something has gone wrong.'});
        }

        try{
            await restoreRepository.save(request.body);
            response.status(201).json({ message: 'Save restore data.'});
        }catch(e){
            response.status(404).json({ message: 'The information could not be backed up.'});
        }
    };   
}

export default RestoreController;