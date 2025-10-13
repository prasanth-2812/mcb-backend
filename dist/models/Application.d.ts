import { Model, Optional } from 'sequelize';
export interface ApplicationAttributes {
    id: string;
    userId: string;
    jobId: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    coverLetter?: string | null;
    resumeUrl?: string | null;
    appliedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export type ApplicationCreation = Optional<ApplicationAttributes, 'id' | 'appliedAt' | 'createdAt' | 'updatedAt'>;
export declare class Application extends Model<ApplicationAttributes, ApplicationCreation> implements ApplicationAttributes {
    id: string;
    userId: string;
    jobId: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    coverLetter: string | null;
    resumeUrl: string | null;
    appliedAt: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=Application.d.ts.map