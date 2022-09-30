import { Request, Response } from 'express';
import { User } from '../entity/User';
import { validate } from 'class-validator';
import { AppDataSource } from '../data-source';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export class AuthController {
    static singin = async (req: Request, res: Response) =>{
        const {username,password} = req.body;
        const singinDate = new Date();
        if(!(username && password)) {
            return res.status(400).json({message: ' Username & Password are required!'});
        }

        const userRepository = AppDataSource.getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneOrFail({where:{username:username}});
        }catch(e){
            console.log(username);
            console.log(password);
            return res.status(400).json({
                message: ' Username or password incorrect!'
            });
        }
        user.UpdateAt = singinDate;
        await userRepository.save(user);

        if(!user.checkPassword(password)){
          return res.status(400).json({message: 'Username or Password are incorrect!'});
        }
        const token = jwt.sign({ userId: user.id, username: user.name }, config.jwtSecret, {expiresIn: '1h' });
        res.json({message: 'Sing in successfull!', token});
    };


    static changePassword = async (req: Request, res: Response) => {
        const { id } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;
    
        if (!(oldPassword && newPassword)) {
          res.status(400).json({ message: 'Old password & new password are required' });
        }
    
        const userRepository = AppDataSource.getRepository(User);
        let user: User;
    
        try {
          user = await userRepository.findOneOrFail({where:{id:id}});
        } catch (e) {
          res.status(400).json({ message: 'Somenthing goes wrong!' });
        }
    
        if (!user.checkPassword(oldPassword)) {
          return res.status(401).json({ message: 'Password incorrect!' });
        }
    
        user.password = newPassword;
        const validationOps = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOps);
    
        if (errors.length > 0) {
          return res.status(400).json(errors);
        }
    
        // Hash password
        user.hashPassword();
        userRepository.save(user);
    
        res.json({ message: 'Password change!' });
      };
}

export default AuthController;