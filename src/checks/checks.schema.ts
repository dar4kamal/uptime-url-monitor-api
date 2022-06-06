import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ProtocolOptions } from 'src/axios/enums';
import { URLAuth, HTTPHeaders, AssertStatusCode } from 'src/axios/interfaces';

@Schema({ versionKey: false })
export class Check extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, enum: ProtocolOptions, required: true })
  protocol: ProtocolOptions;

  @Prop({ type: String })
  path?: string;

  @Prop({ type: Number })
  port?: number;

  @Prop({ type: String })
  webhook?: string;

  @Prop({ type: Number, default: 5 })
  timeout?: number;

  @Prop({ type: Number, default: 10 })
  interval?: number;

  @Prop({ type: Number, default: 1 })
  threshold?: number;

  @Prop({
    type: {
      username: String,
      password: String,
    },
  })
  authentication?: URLAuth;

  @Prop({ type: [{ type: Map, of: String }] })
  httpHeaders?: HTTPHeaders[];

  @Prop({ type: { statusCode: Number } })
  assert?: AssertStatusCode;

  @Prop({ type: [{ type: String }] })
  tags?: string[];

  @Prop({ type: Boolean, required: true })
  ignoreSSL: boolean;
}

export const CheckSchema = SchemaFactory.createForClass(Check);
