import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Category } from "./category.schema";
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    resetPasswordOtp: number;

    @Prop()
    address?: string; // Added field

    @Prop()
    image?: string; // Added field

    @Prop()
    dateOfBirth?: Date; // Added field

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }])
    categories: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
