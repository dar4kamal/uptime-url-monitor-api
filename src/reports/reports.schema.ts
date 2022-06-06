import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { URLStatus } from 'src/axios/enums';
import { ReportHistory } from './interfaces';

@Schema({ versionKey: false })
export class Report extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Check', required: true })
  checkId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: URLStatus })
  status: URLStatus;

  @Prop({ type: Number, default: 0 })
  availability: number;

  @Prop({ type: Number, default: 0 })
  outages: number;

  @Prop({ type: Number, default: 0 })
  uptime: number;

  @Prop({ type: Number, default: 0 })
  downtime: number;

  @Prop({ type: Number, default: 0 })
  responseTime: number;

  @Prop({
    type: [
      {
        createdAt: { type: Date },
        responseTime: { type: Number },
        status: { type: String, enum: URLStatus },
      },
    ],
    default: [],
  })
  history?: ReportHistory[];

  @Prop({ type: [{ type: String }], default: [] })
  tags?: string[];
}

export const ReportSchema = SchemaFactory.createForClass(Report);
