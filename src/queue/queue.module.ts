import { Module } from '@nestjs/common';
import { AuditQueue } from './audit/audit.queue';

@Module({
  providers: [AuditQueue]
})
export class QueueModule {}
