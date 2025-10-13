import { Request, Response, NextFunction } from 'express';
export declare function listCandidates(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getCandidate(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createCandidate(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateCandidate(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteCandidate(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=candidates.controller.d.ts.map