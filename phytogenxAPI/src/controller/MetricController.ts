import { Request, Response } from 'express';
import { User } from '../entity/User';
import { validate } from 'class-validator';
import { AppDataSource } from '../data-source';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { UsingJoinColumnIsNotAllowedError } from 'typeorm';
import { Data } from '../entity/masterdata';


/**
 * Controlador para la
 * Autentificación de los usuarios y
 * creación de Tokens de sesión. 
 */
export class MetricController {
  static getCmsFound = async (request: Request, response: Response) => {
    const mdRepository = AppDataSource.getRepository(Data);
    let mdList: any[];
    try{
        mdList = await mdRepository.query('CALL dash_PO()');
    }catch(e){
        response.status(404).json({message: 'Somenthing goes wrong, Please contact with your administrator.'});
    }
    
    if(mdList.length > 0){
        response.send(mdList[0]);
    }else{
        response.status(404).json({message: 'Sorry, the requested information was not found.'});
    }
  }

  static getCmsLoader = async (request: Request, response: Response) => {
    const mdRepository = AppDataSource.getRepository(Data);
    let mdList: any[];
    try{
        mdList = await mdRepository.query('CALL PO_Loaded()');
    }catch(e){
        response.status(404).json({message: 'Somenthing goes wrong, Please contact with your administrator.'});
    }
    
    if(mdList.length > 0){
        response.send(mdList[0]);
    }else{
        response.status(404).json({message: 'Sorry, the requested information was not found.'});
    }
  }
  
  static getQbFound = async (request: Request, response: Response) => {
    const mdRepository = AppDataSource.getRepository(Data);
    let mdList: any[];
    try{
        mdList = await mdRepository.query('CALL Invoice_found()');
    }catch(e){
        response.status(404).json({message: 'Somenthing goes wrong, Please contact with your administrator.'});
    }
    
    if(mdList.length > 0){
        response.send(mdList[0]);
    }else{
        response.status(404).json({message: 'Sorry, the requested information was not found.'});
    }
  }

  static getQbLoader = async (request: Request, response: Response) => {
    const mdRepository = AppDataSource.getRepository(Data);
    let mdList: any[];
    try{
        mdList = await mdRepository.query('CALL Invoice_Loaded()');
    }catch(e){
        response.status(404).json({message: 'Somenthing goes wrong, Please contact with your administrator.'});
    }
    
    if(mdList.length > 0){
        response.send(mdList[0]);
    }else{
        response.status(404).json({message: 'Sorry, the requested information was not found.'});
    }
  }
}

export default MetricController;