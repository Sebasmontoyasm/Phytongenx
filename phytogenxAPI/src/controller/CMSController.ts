import {Request, Response } from "express";
import { Data } from "../entity/masterdata";
import { CmsPerformance } from "../interface/cms_performance";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { Labresults } from "../entity/Labresults";

/**
 * Contraladora para el modulo 
 * CMS en el que tiene el CRUD
 * y se actualizan los datos que no
 * fuerón procesados automaticamente.
 */
export class CMSController {

    /**
     * @param response obtiene las ordenes de compra incompletas 
     * y no procesadas por falta de información.
     */
    static getAll = async (request: Request, response: Response) => {
        const cmsRepository = AppDataSource.getRepository(Data);
        let cmsPerList: Data[];
        try{
            cmsPerList = await cmsRepository.query('call cmsmanualprocedure()');

            if(cmsPerList.length > 0){
                response.send(cmsPerList[0]);
                
            }else{
                response.status(404).json({message: 'Not results found'});
            }

        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong'});
        }
    }
    /**
     * CMS detail
     * @param request PO_Number unico para obtener los examanes de laboratorio de la orden de compra.
     * @param response Examanes de labotorio según la Orden de Compra.
     */
    static getById = async (request: Request, response: Response) => {
        const ponumber = request.params.ponumber;
        const labresultRepository = AppDataSource.getRepository(Labresults);
        try{
            const labresults: Labresults[] = await labresultRepository.query('call labresult_detail(?)',[ponumber])
            response.send(labresults[0]);
        }catch(e){
            response.status(404).json({ message: 'Not results found'});
        }
    };
    /**
     * Revisa si ya se ha almacenado ese examen de laboratorio.
     * @param request Nombre del PDF.
     * @param response Habita la creación del archivo o reporta que ya existe.
     */
    static getPDF_Name = async (request: Request, response: Response) => {
        const PDF_Name = request.params.pdfname;
        const mdRepository = AppDataSource.getRepository(Data);

        let pdfFound: Data[];
        pdfFound = await mdRepository.createQueryBuilder()
        .where("LOWER(PDF_Name) = LOWER(:PDF_Name)", { PDF_Name }).getMany();

            
        if(!pdfFound[0]){
            response.status(201).json({ message: 'New File.'});
        }else{
            response.status(404).json({ message: "Lab Result already exists, please change name or check if file already exist in the database."});
        } 
    };

    /**
     * CMS Performance del procesamiento
     * de Pedro en tiempos y fechas. 
     * @param response CMS Performance información.
     */
    static performance = async (request: Request, response: Response) => {
        const cmsPerformanceRepository = AppDataSource.getRepository(Labresults);
        let cmsPerList: CmsPerformance[];
        try{
            cmsPerList = await cmsPerformanceRepository.query('call cms_performance()');
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong'});
        }

        if(cmsPerList.length > 0){
            response.send(cmsPerList[0]);
            
        }else{
            response.status(404).json({message: 'The requested information is not found.'});
        }
    }
    /**
     * Guardar examen de laboratorio en la ruta del middlewares.
     * @param request middlewares para guardar archivo en la carpeta destino.
     */
    static upload = async (request: Request, response: Response) =>{
        response.send({data: 'File updload'});
    };

    /**
     * Actualizar registros que no fuerón procesados correctamente
     * de manera manual, es 1 registro por cada uno.
     * @param request Obtiene el identificador del registro junto con la información que se debe actualizar.
     */
    static update = async (request: Request, response: Response) =>{
        try{
            const cmsRepository = AppDataSource.getRepository(Data);
            const {cmsDate,PDF_Name} = request.body;
            let cms:Data;
            const id = Number(request.params.id);
            try{
                cms = await cmsRepository.findOneOrFail({where:{ID:id}});
                cms.Date_CSM_Processed = cmsDate;
                cms.PDF_Name = PDF_Name;
            }catch(e){
                response.status(404).json({ message: 'The information not found.'});
            }
            const validationOpt = { validationError: { target: false, value: false } };
            const errors = await validate(cms,validationOpt);
            
            if(errors.length > 0){
                return response.status(400).json(errors);
            }

            try{
                await cmsRepository.save(cms);
                return response.status(201).json({message: 'Manually proccessed cms performed.'});
            }catch(e){
                return response.status(409).json({menssage: 'Unknown error.'})
            }
        }catch(e){

        }
    };
}