import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
@Schema()
export class Category {

    @Prop()
    name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);