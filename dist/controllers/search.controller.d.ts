import { Request, Response, NextFunction } from 'express';
export declare function searchJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getFilterOptions(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getRecommendedJobs(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=search.controller.d.ts.map