import { Model, Optional } from 'sequelize';
export interface CandidateAttributes {
    id: number;
    name: string;
    jobTitle?: string | null;
    location?: string | null;
}
export type CandidateCreation = Optional<CandidateAttributes, 'id'>;
export declare class Candidate extends Model<CandidateAttributes, CandidateCreation> implements CandidateAttributes {
    id: number;
    name: string;
    jobTitle: string | null;
    location: string | null;
}
//# sourceMappingURL=Candidate.d.ts.map