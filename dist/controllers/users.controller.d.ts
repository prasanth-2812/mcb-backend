import { Request, Response, NextFunction } from 'express';
export declare function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=users.controller.d.ts.map