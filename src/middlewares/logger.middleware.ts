import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
    if(req.url !== "/") {
        console.log(Date() + '\n\nURL: ' + req.url + '\n\nBody:');
        console.log(req.method)
        console.log(req.body);
        console.log('\n\nHeaders:');
        console.log(req.headers);
    }
    next();
};