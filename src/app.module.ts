import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { UsersModule } from './users/users.module';
import { AlertModule } from './alert/alert.module';
import { ChecksModule } from './checks/checks.module';

import { UniversalExceptionFilter } from './utils/universal.filter';
import { TransformInterceptor } from './utils/transform.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/url-monitor'),
    UsersModule,
    AlertModule,
    ChecksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: UniversalExceptionFilter,
    },
  ],
})
export class AppModule {}
