import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';
import { Rating } from "./rating.schema";
@Schema()
export class Movie {

    @Prop()
    name: string;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
    category: Category;
    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Rating' }])
    ratings: MongooseSchema.Types.ObjectId[];

}

export const MovieSchema = SchemaFactory.createForClass(Movie);