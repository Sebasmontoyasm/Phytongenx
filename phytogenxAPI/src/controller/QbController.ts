
import {Request, Response } from "express";
import { Data } from "../entity/masterdata";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { Invoices } from "../entity/Invoices";
import { QbPerformance } from "../interface/qb_perfomance";

export class QbController {

    static getAll = async (request: Request, response: Response) => {
        const mdRepository = AppDataSource.getRepository(Data);
        let mdList: Data[];
        try{
            mdList = await mdRepository.query('call qbmanually()');
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(mdList.length > 0){
            response.send(mdList[0]);
            
        }else{
            response.status(404).json({message: 'Not Result'});
        }
    }

    static getPerformance = async (request: Request, response: Response) => {
        const invoicesRepository = AppDataSource.getRepository(Invoices);
        let qbPerformance: QbPerformance[];
        try{
            qbPerformance = await invoicesRepository.query('call qb_performance()');
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(qbPerformance.length > 0){
            response.send(qbPerformance[0]);
        }else{
            response.status(404).json({message: 'Not Result'});
        }
    }

    static getByInvoice = async (request: Request, response: Response) => {
        const invoice = request.params.invoice;
        let qbdetails: Invoices[];
        const invoiceRepository = AppDataSource.getRepository(Invoices);
        
        try{
            qbdetails = await invoiceRepository.find({
                                                            where:{InvoiceNumber:invoice},
                                                            order:{Date:"DESC"}
                                                        });
        }catch(e){
            response.status(404).json({message: 'Somenthing goes wrong!'});
        }

        if(qbdetails.length > 0){
            response.send(qbdetails);
        }else{
            response.status(404).json({message: 'Not Result'});
        }
    };

    static update = async (request: Request, response: Response) =>{
        const qbRepository = AppDataSource.getRepository(Data);
        const {Invoice_Number,NamePDF,Date_invoice_recieved} = request.body;
    
        let qb:Data;
        const id = Number(request.params.id);
        try{
            qb = await qbRepository.findOneOrFail({where:{ID:id}});

            if(Invoice_Number || Invoice_Number != 0){
                let invoiceFound: Data;
                invoiceFound = await qbRepository.findOne({where:{Invoice_Number:Invoice_Number}});
                
                if(!invoiceFound){
                    qb.Invoice_Number = Invoice_Number;
                }else{
                    return response.status(302).json({message: 'Invoice Found.'})    
                }              
            }

            const validationOpt = { validationError: { target: false, value: false } };
            const errors = await validate(qb,validationOpt);
        
            if(errors.length > 0){
                return response.status(400).json(errors);
            }

            qb.NamePDF = NamePDF;
            qb.Date_invoice_recieved = Date_invoice_recieved;
            qb.Date_Quickbooks_Processed = 'Manually proccessed.';

            try{
                await qbRepository.save(qb);
            }catch(e){
                return response.status(409).json({menssage: 'Unknown error, contact your administrator.'})
            }

        }catch(e){
            response.status(404).json({ message: 'Qb not found'});
        }    

        return response.status(201).json({message: 'Manually proccessed qb performed.'});
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

        response.status(201).json({message: 'Data deleted'});
    };
}

export default QbController;
