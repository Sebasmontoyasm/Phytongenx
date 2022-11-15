import { Request, Response } from 'express';
import { User } from '../entity/User';
import { validate } from 'class-validator';
import { AppDataSource } from '../data-source';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';


/**
 * Controlador para la
 * Autentificación de los usuarios y
 * creación de Tokens de sesión. 
 */
export class AuthController {

    /**
     * 
     * @param req (Usuario y contraseña para registro)
     * @param res (Tokens y usuario para la sesión)
     * @returns Token de registro
     * @returns Usuario registrado.
     * @returns Rol de autentificación.
     */
    static singin = async (req: Request, res: Response) =>{
        const {username,password,UpdateAt} = req.body;
        let rol: string;
        if(!(username && password)) {
            return res.status(400).json({message: 'Username or password are required.'});
        }

        const userRepository = AppDataSource.getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneOrFail({where:{username:username}});
            rol = user.rol;
        }catch(e){
            return res.status(400).json({
                message: 'Username or password incorrect.'
            });
        }
        user.UpdateAt = UpdateAt;
        await userRepository.save(user);

        if(!user.checkPassword(password)){
          return res.status(400).json({message: 'Username or Password are incorrect.'});
        }
        const token = jwt.sign({ userId: user.id, username: user.name }, config.jwtSecret, {expiresIn: '1h' });
        res.json({message: 'Sing in successfull!', token,username, rol});
    };

    /**
     * Metodo para actualizar la clave.
     * @param req (Clave nueva)
     * @param res "Mensaje de clave cambiada."
     * @returns "Mensaje de Satifactorio o de error."
     */

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
    
        user.hashPassword();
        userRepository.save(user);
    
        res.json({ message: 'Password change!' });
      };
}

export default AuthController;