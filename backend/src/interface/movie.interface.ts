import { Document, Types } from 'mongoose';
import { IRating } from './rating.interface';

export interface IMovie extends Document {
    readonly name: string;
    readonly ratings: Types.ObjectId[];
}
