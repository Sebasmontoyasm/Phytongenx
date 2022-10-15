
import {Request, Response } from "express";
import { Data } from "../entity/masterdata";
import { AppDataSource } from "../data-source";
import { validate} from "class-validator";

export class QbController {

    static getAll = async (request: Request, response: Response) => {
        const qbRepository = AppDataSource.getRepository(Data);
        let qbList: Data[];
        try{
            qbList = await qbRepository.find();
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(qbList.length > 0){
            response.send(qbList);
            
        }else{
            response.status(404).json({message: 'Not Result'});
        }
    }

    static getById = async (request: Request, response: Response) => {
        const id = Number(request.params.id);
        const qbRepository = AppDataSource.getRepository(Data);
        
        try{
            const qb = await qbRepository.findOneOrFail({where:{ID:id}});
            response.send(qb);
        }catch(e){
            response.status(404).json({ message: 'Not result'});
        }
    };

    static newcms = async (request: Request, response: Response) => {
        const qbRepository = AppDataSource.getRepository(Data);
        const {ponumber,Date_CSM_Processed,PDF_Name} = request.body;
        const qb: Data = new Data;

        qb.PO_Number = ponumber;
        qb.Date_CSM_Processed =Date_CSM_Processed;
        qb.PDF_Name = PDF_Name;
        qb.Date_Quickbooks_Processed = 'Waiting for Pedro RPA.';

        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(qb,validationOpt);
        
        if(errors.length > 0){
            return response.status(400).json(errors);
        }

        try{
            await qbRepository.save(qb);
            response.status(201).json({ message: 'CMS process created'});
        }catch(e){
            console.log("Error: "+e);
            response.status(404).json({ message: 'Not result'});
        }
    };

    static updatecms = async (request: Request, response: Response) =>{
        const qbRepository = AppDataSource.getRepository(Data);
        const {cmsDate,PDF_Name} = request.body;
        let qb:Data;
        const id = Number(request.params.id);
        try{
            qb = await qbRepository.findOneOrFail({where:{ID:id}});
            qb.Date_CSM_Processed = cmsDate;
            qb.PDF_Name = PDF_Name;
            qb.Date_Quickbooks_Processed = 'Waiting for Pedro RPA.';
        }catch(e){
            response.status(404).json({ message: 'Cms not found'});
        }
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(qb,validationOpt);
        
        if(errors.length > 0){
            return response.status(400).json(errors);
        }

        try{
            await qbRepository.save(qb);
        }catch(e){
            return response.status(409).json({menssage: 'Unknown error, contact your administrator.'})
        }

        return response.status(201).json({message: 'Manual process performed.'});
    };

    static delete = async (request: Request, response: Response) =>{
        const qbRepository = AppDataSource.getRepository(Data);
        let qb:Data;
        const id = Number(request.params.id);

        try{
            qb = await qbRepository.findOneOrFail({where:{ID:id}});
        }catch(e){
            response.status(404).json({ message: 'Unknown error, contact your administrator.'});
        }
        
        qbRepository.delete(id);

        response.status(201).json({message: 'User deleted'});
    };
}

export default QbController;