import { Model, Optional } from 'sequelize';
export interface JobAttributes {
    id: string;
    title: string;
    company: string;
    companyId?: string | null;
    location?: string | null;
    type?: string | null;
    category?: string | null;
    isRemote?: boolean | null;
    description?: string | null;
}
export type JobCreation = Optional<JobAttributes, 'id'>;
export declare class Job extends Model<JobAttributes, JobCreation> implements JobAttributes {
    id: string;
    title: string;
    company: string;
    companyId: string | null;
    location: string | null;
    type: string | null;
    category: string | null;
    isRemote: boolean | null;
    description: string | null;
}
//# sourceMappingURL=Job.d.ts.map