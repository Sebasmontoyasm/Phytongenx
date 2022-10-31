import * as multer from 'multer';
import path = require('path');

export const uploadFile = (process:string) => {
    if(process === 'cms'){

        const storage = multer.diskStorage({
            filename: function(res, file, cb){
                cb(null,`${file.originalname}`);
            },
            destination: function(res, file, cb){
                cb(null,'./src/ftp/cms');
            },
        });
    
        const upload = multer({storage:storage,
            fileFilter: (req,file,cb) => {
                const fileTypes = /pdf/;    
                const mimetype = fileTypes.test(file.mimetype);
                const ext = fileTypes.test(path.extname(file.originalname));

                if(mimetype && ext){
                    return cb(null,true);
                }     
              
                return cb(null,false);
            }
        });

        return upload.single('file');

    }else if(process === 'qb'){

        const storage = multer.diskStorage({
            filename: function(res, file, cb){
                cb(null,`${file.originalname}`);
            },
            destination: function(res, file, cb){
                cb(null,'./src/ftp/qb');
            },
        });
    
        const upload = multer({storage:storage,
            fileFilter: (req,file,cb) => {
                const fileTypes = /pdf/;    
                const mimetype = fileTypes.test(file.mimetype);
                const ext = fileTypes.test(path.extname(file.originalname));

                if(mimetype && ext){
                    return cb(null,true);
                }     
              
                return cb(null,false);
            }
        });

        return upload.single('file');
    }
};