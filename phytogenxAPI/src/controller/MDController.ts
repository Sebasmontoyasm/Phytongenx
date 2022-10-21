import {Request, Response } from "express";
import { Data } from "../entity/masterdata";
import { Masterdata } from  "../interface/masterdata";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";


export class MDController {

    static getAll = async (request: Request, response: Response) => {
        const mdRepository = AppDataSource.getRepository(Data);
        let mdList: Masterdata[];
        try{
            mdList = await mdRepository.query('call masterdata()');
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(mdList.length > 0){
            response.send(mdList[0]);
            
        }else{
            response.status(404).json({message: 'Not Result'});
        }
    }

    static getById = async (request: Request, response: Response) => {
        const id = Number(request.params.id);
        const mdRepository = AppDataSource.getRepository(Data);
        
        try{
            const md = await mdRepository.findOneOrFail({where:{ID:id}});
            response.send(md);
        }catch(e){
            response.status(404).json({ message: 'Not result'});
        }
    };
    
    static getLastId = async (request: Request, response: Response) => {
        const mdRepository = AppDataSource.getRepository(Data);
        let data: Data[];
        
        try{
            data = await mdRepository.find({order: { ID: 'DESC' }, take:1})
            response.send(data[0]);
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }
    }

    static new = async (request: Request, response: Response) => {
        const mdRepository = AppDataSource.getRepository(Data);
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(request.body,validationOpt);
          
        const {PO_Number} = request.body;

        if(errors.length > 0){
            return response.status(400).json(errors);
        } 

        let PoFound: Data[];
        PoFound = await mdRepository.createQueryBuilder()
        .where("LOWER(PO_Number) = LOWER(:PO_Number)", { PO_Number }).getMany();

        if(!PoFound[0]){
            try{
                await mdRepository.save(request.body);
                response.status(201).json({ message: 'CMS process created'});
            }catch(e){
                response.status(404).json({ message: 'Not result'});
            }
          
        }else{
            response.status(302).json({ message: 'PO Number Found.'});    
        } 
    };

    static delete = async (request: Request, response: Response) =>{
        const mdRepository = AppDataSource.getRepository(Data);
        let md:Data;
        const id = Number(request.params.id);

        try{
            md = await mdRepository.findOneOrFail({where:{ID:id}});
        }catch(e){
            response.status(404).json({ message: 'Unknown error, contact your administrator.'});
        }
        
        mdRepository.delete(id);

        response.status(201).json({message: 'Data deleted'});
    };
}

export default MDController;
