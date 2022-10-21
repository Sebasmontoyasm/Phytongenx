import {Request, Response } from "express";
import { Data } from "../entity/masterdata";
import { CmsPerformance } from "../interface/cms_performance";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { Labresults } from "../entity/Labresults";

export class CMSController {

    static getAll = async (request: Request, response: Response) => {
        const cmsRepository = AppDataSource.getRepository(Data);
        let cmsPerList: Data[];
        try{
            cmsPerList = await cmsRepository.query('call cmsupmanualprocedure()');
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(cmsPerList.length > 0){
            response.send(cmsPerList[0]);
            
        }else{
            response.status(404).json({message: 'Not Result'});
        }
    }

    static getById = async (request: Request, response: Response) => {
        const ponumber = request.params.ponumber;
        const labresultRepository = AppDataSource.getRepository(Labresults);
        try{
            const labresults: Labresults[] = await labresultRepository.query('call labresult_detail(?)',[ponumber])
            response.send(labresults[0]);
        }catch(e){
            response.status(404).json({ message: 'Not result'});
        }
    };

    static performance = async (request: Request, response: Response) => {
        const cmsPerformanceRepository = AppDataSource.getRepository(Labresults);
        let cmsPerList: CmsPerformance[];
        try{
            cmsPerList = await cmsPerformanceRepository.query('call cms_performance()');
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(cmsPerList.length > 0){
            response.send(cmsPerList[0]);
            
        }else{
            response.status(404).json({message: 'Not Result'});
        }
    }

    static update = async (request: Request, response: Response) =>{
        const cmsRepository = AppDataSource.getRepository(Data);
        const {cmsDate,PDF_Name} = request.body;
        let cms:Data;
        const id = Number(request.params.id);
        try{
            cms = await cmsRepository.findOneOrFail({where:{ID:id}});
            cms.Date_CSM_Processed = cmsDate;
            cms.PDF_Name = PDF_Name;
        }catch(e){
            response.status(404).json({ message: 'Cms not found'});
        }
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(cms,validationOpt);
        
        if(errors.length > 0){
            return response.status(400).json(errors);
        }

        try{
            await cmsRepository.save(cms);
        }catch(e){
            return response.status(409).json({menssage: 'Unknown error, contact your administrator.'})
        }

        return response.status(201).json({message: 'Manually proccessed cms performed.'});
    };

}