import { Document, Types } from 'mongoose';
import { IUser } from './user.interface';
import { IMovie } from './movie.interface';

export interface IRating extends Document {
    readonly user: IUser | Types.ObjectId;
    readonly movie: IMovie | Types.ObjectId;
    readonly rating: number;
}
