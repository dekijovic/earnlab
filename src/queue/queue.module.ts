import { Module } from '@nestjs/common';
import {AuditProcessor} from "./audit/audit.processor";
import {BullModule} from "@nestjs/bull";

@Module({
  providers: [AuditProcessor],
  imports:[
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: +(process.env.REDIS_PORT || 6379),
      },
    }),
    BullModule.registerQueue({
      name: 'audit',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
