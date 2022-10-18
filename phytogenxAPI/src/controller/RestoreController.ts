import { Request, Response } from "express";
import { Restore } from "../entity/Restore";
import { AppDataSource } from "../data-source";
import { validate} from "class-validator";

export class RestoreController {
    static getAll = async (request: Request, response: Response) => {
        const restoreRepository = AppDataSource.getRepository(Restore);
        let restores: Restore[];
        try{
            restores = await restoreRepository.find();
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(restores.length > 0){
            response.send(restores[0]);
            
        }else{
            response.status(404).json({message: 'Not Result'});
        }
    }

    static save = async (request: Request, response: Response) => {
        
        const restoreRepository = AppDataSource.getRepository(Restore);
        
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(request.body,validationOpt);

        if(errors.length > 0){
            return response.status(400).json(errors);
        }

        try{
            await restoreRepository.save(request.body);
            response.status(201).json({ message: 'Save restore data.'});
        }catch(e){
            console.log("Error: "+e);
            response.status(404).json({ message: 'Fail restore data.'});
        }
    };   
}

export default RestoreController;