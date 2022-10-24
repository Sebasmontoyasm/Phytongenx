import {Request, Response } from "express";
import { Userlog } from "../entity/Userlog";
import { AppDataSource } from "../data-source";
import { validate} from "class-validator";


export class UserlogsController {

    static getAll = async (request: Request, response: Response) => {
        const userlogsRepository = AppDataSource.getRepository(Userlog);
        let userslogs: Userlog[];
        try{
            userslogs = await userlogsRepository.find();
        }catch(e){
            response.status(400).json({message: 'Somenthing goes wrong!'});
        }

        if(userslogs.length > 0){
            response.send(userslogs);
            
        }else{
            response.status(404).json({message: 'You have no records registered so far.'});
        }
    }

    static new = async (request: Request, response: Response) => {
        
        const userlogRepository = AppDataSource.getRepository(Userlog);
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(request.body,validationOpt);
        
        if(errors.length > 0){
            return response.status(400).json({message: 'Something goes wrong'});
        }

        try{
            await userlogRepository.save(request.body);
            response.status(201).json({ message: 'Log created'});
        }catch(e){
            response.status(400).json({ message: 'Somenthing goes wrong!'});
        }
    };   
}

export default UserlogsController;
