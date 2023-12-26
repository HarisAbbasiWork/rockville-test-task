// rating.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IUser } from '../interface/user.interface';
import { IMovie } from '../interface/movie.interface';

@Schema()
export class Rating {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: IUser;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie', required: true })
    movie: IMovie;

    @Prop({ required: true })
    rating: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
