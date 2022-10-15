import {Request, Response } from "express";
import { Data } from "../entity/masterdata";
import { AppDataSource } from "../data-source";
import { validate} from "class-validator";

export class MDController {

    static getAll = async (request: Request, response: Response) => {
        const mdRepository = AppDataSource.getRepository(Data);
        let mdList: Data[];
        try{
            mdList = await mdRepository.find();
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(mdList.length > 0){
            response.send(mdList);
            
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

    static newcms = async (request: Request, response: Response) => {
        const mdRepository = AppDataSource.getRepository(Data);
        const {ponumber,Date_CSM_Processed,PDF_Name} = request.body;
        const md: Data = new Data;

        md.PO_Number = ponumber;
        md.Date_CSM_Processed =Date_CSM_Processed;
        md.PDF_Name = PDF_Name;
        md.Date_Quickbooks_Processed = 'Waiting for Pedro RPA.';

        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(md,validationOpt);
        
        if(errors.length > 0){
            return response.status(400).json(errors);
        }

        try{
            await mdRepository.save(md);
            response.status(201).json({ message: 'CMS process created'});
        }catch(e){
            console.log("Error: "+e);
            response.status(404).json({ message: 'Not result'});
        }
    };

    static updatecms = async (request: Request, response: Response) =>{
        const mdRepository = AppDataSource.getRepository(Data);
        const {cmsDate,PDF_Name} = request.body;
        let md:Data;
        const id = Number(request.params.id);
        try{
            md = await mdRepository.findOneOrFail({where:{ID:id}});
            md.Date_CSM_Processed = cmsDate;
            md.PDF_Name = PDF_Name;
            md.Date_Quickbooks_Processed = 'Waiting for Pedro RPA.';
        }catch(e){
            response.status(404).json({ message: 'Cms not found'});
        }
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(md,validationOpt);
        
        if(errors.length > 0){
            return response.status(400).json(errors);
        }

        try{
            await mdRepository.save(md);
        }catch(e){
            return response.status(409).json({menssage: 'Unknown error, contact your administrator.'})
        }

        return response.status(201).json({message: 'Manual process performed.'});
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

        response.status(201).json({message: 'User deleted'});
    };
}

export default MDController;
