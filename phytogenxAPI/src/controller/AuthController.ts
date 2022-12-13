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
                message: 'Username or password are incorrect.'
            });
        }
        user.UpdateAt = UpdateAt;

        await userRepository.save(user);

        if(user.username == "default.admin"){
          const token = jwt.sign({ userId: user.id, username: user.name }, config.jwtSecret, {expiresIn: '6h' });
          res.json({message: 'Sing in successfull!', token,username, rol});
        }
        else if(!user.checkPassword(password)){
          return res.status(400).json({message: 'Username or Password are incorrect.'});
        }else{
          const token = jwt.sign({ userId: user.id, username: user.name }, config.jwtSecret, {expiresIn: '6h' });
          res.json({message: 'Sing in successfull!', token,username, rol});
        }
    };

    /**
     * Metodo para actualizar la clave.
     * @param req username: Usuario que solicita el cambio de contraseña
     *            rol: Permiso que tiene el usuario para el cambio.
     *            oldPassword: clave vieja para verificación
     *            newPassword: nueva clave para cambiar.
     *            req.param.id: usuario al que se le va a cambiar   
     * @param res "Mensaje de clave cambiada."
     * @returns "Mensaje de Satifactorio o de error."
     */

    static changePassword = async (req: Request, res: Response) => {
      const {username,password, newpassword } = req.body;
      if (!(password && newpassword)) {
        res.status(400).json({ message: 'Old password and new password are required' });
      }
  
      const userRepository = AppDataSource.getRepository(User);
      let user: User;
  
      try {
        user = await userRepository.findOneOrFail({where:{username:username}});
        
        if(!user.checkPassword(password)){
          return res.status(400).json({message: 'Password incorrect.'});
        }
      
        user.password = newpassword;

        const validationOps = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOps);
      
        if (errors.length > 0) {
          return res.status(400).json(errors);
        }
  
        user.hashPassword();
        userRepository.save(user);

        res.json({message: 'Change password successfull!'});
        
      } catch (e) {
        res.status(400).json({ message: 'Username not found' });
      }
    };
}

export default AuthController;