import { randomUUID } from 'crypto';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const minPasswordLength = 4;
export const maxPasswordLength = 8;

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String, default: randomUUID() })
  verifyToken: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
