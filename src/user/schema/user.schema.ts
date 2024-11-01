import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RegistrationMethod } from 'src/enums/users/registration-method.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true, enum: RegistrationMethod }) // Use the enum here
  registrationMethod: RegistrationMethod;

  @Prop()
  password?: string; // Optional for OAuth users
}

export const UserSchema = SchemaFactory.createForClass(User);
