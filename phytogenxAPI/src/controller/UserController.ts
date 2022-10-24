import {Request, Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { validate} from "class-validator";

export class UserController {

    static getAll = async (request: Request, response: Response) => {
        const userRepository = AppDataSource.getRepository(User);
        let users: User[];
        try{
            users = await userRepository.find();
        }catch(e){
            response.status(404).json({message: 'Something has gone wrong'});
        }

        if(users.length > 0){
            response.send(users);
            
        }else{
            response.status(404).json({message: 'Could not get information in the request'});
        }
    }

    static getById = async (request: Request, response: Response) => {
        const id = Number(request.params.id);
        const userRepository = AppDataSource.getRepository(User);
        
        try{
            const user = await userRepository.findOneOrFail({where:{id:id}});
            response.send(user);
        }catch(e){
            response.status(404).json({ message: 'Could not get information in the request'});
        }
    };

    static new = async (request: Request, response: Response) => {
        const userRepository = AppDataSource.getRepository(User);
        const {name,rol,username,password,createdAt} = request.body;
        const user: User = new User;

        user.name = name;
        user.rol = rol;
        user.username = username.toLowerCase();
        user.password = password;
        user.createdAt = createdAt;
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
            response.status(302).json({ message: 'You cannot create the same user.'});
        }
    };

    static update = async (request: Request, response: Response) =>{
        try{
            const userRepository = AppDataSource.getRepository(User);
            const {name,rol,password} = request.body;
            let user:User;
            const id = Number(request.params.id);
            try{
                user = await userRepository.findOneOrFail({where:{id:id}});
                user.name = name;
                user.rol = rol;
                user.password = password;
            }catch(e){
                response.status(404).json({ message: 'Could not find user required'});
            }

            const validationOpt = { validationError: { target: false, value: false } };
            const errors = await validate(user,validationOpt);
            
            if(errors.length > 0){
                return response.status(400).json({message: 'Something has gone wrong'});
            }

            try{
                user.hashPassword();
                await userRepository.save(user);
                return response.status(201).json({message: 'User updated.'});
            }catch(e){
                return response.status(409).json({menssage: 'Username already in use'})
            }

          
        }catch(e){

        }
    };

    static delete = async (request: Request, response: Response) =>{
        try{
            const userRepository = AppDataSource.getRepository(User);
            let user:User;
            const id = Number(request.params.id);

            try{
                user = await userRepository.findOneOrFail({where:{id:id}});
            }catch(e){
                response.status(404).json({message: 'The user was deleted before you tried to delete him'});
            }
            
            try{
                await userRepository.delete(id);  
                response.status(201).json({message: 'User deleted'});
            }catch(e){
                return response.status(400).json({message: 'Something has gone wrong'});
            }
        }catch(e){
            
        }
    };
}

export default UserController;
