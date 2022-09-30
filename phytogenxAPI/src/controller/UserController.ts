import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"
import { validate} from "class-validator";

export class UserController {

    static getAll = async (request: Request, response: Response) => {
        const userRepository = AppDataSource.getRepository(User);
        let users: User[];
        try{
            users = await userRepository.find();
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(users.length > 0){
            response.send(users);
            
        }else{
            response.status(404).json({message: 'Not Result'});
        }
    }

    static getById = async (request: Request, response: Response) => {
        const id = Number(request.params.id);
        const userRepository = AppDataSource.getRepository(User);
        
        try{
            const user = await userRepository.findOneOrFail({where:{id:id}});
            response.send(user);
        }catch(e){
            response.status(404).json({ message: 'Not result'});
        }
    };

    static new = async (request: Request, response: Response) => {
        const userRepository = AppDataSource.getRepository(User);
        const {name,rol,username,password} = request.body;
        const user: User = new User;
        
        user.name = name;
        user.rol = rol;
        user.username = username;
        user.password = password;

        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(user,validationOpt);
        
        if(errors.length > 0){
            return response.status(400).json(errors);
        }

        try{
            user.hashPassword();
            await userRepository.save(user);
            response.status(201).json({ message: 'User created'});
        }catch(e){
            console.log("Error: "+e);
            response.status(404).json({ message: 'Not result'});
        }
    };

    static update = async (request: Request, response: Response) =>{

        const userRepository = AppDataSource.getRepository(User);
        const {name,rol,username,password} = request.body;
        let user:User;
        const id = Number(request.params.id);

        try{
            user = await userRepository.findOneOrFail({where:{id:id}});
            user.name = name;
            user.rol = rol;
            user.username = username;
            user.password = password;
        }catch(e){
            response.status(404).json({ message: 'User not found'});
        }
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(user,validationOpt);
        
        if(errors.length > 0){
            return response.status(400).json(errors);
        }

        try{
            await userRepository.save(user);
        }catch(e){
            return response.status(409).json({menssage: 'Username already in use'})
        }

        return response.status(201).json({message: 'User update'});
    };

    static delete = async (request: Request, response: Response) =>{
        const userRepository = AppDataSource.getRepository(User);
        let user:User;
        const id = Number(request.params.id);

        try{
            user = await userRepository.findOneOrFail({where:{id:id}});
        }catch(e){
            response.status(404).json({ message: 'User not found'});
        }
        
        userRepository.delete(id);

        response.status(201).json({message: 'User deleted'});
    };
}

export default UserController;
