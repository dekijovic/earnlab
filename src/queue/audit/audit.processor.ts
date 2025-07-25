// src/queue/audit.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import {CreditTransferJob} from "../job-interface/credit-transfer.job";

@Processor('audit')
export class AuditProcessor {
    @Process('credit-transfer')
    async handleCreditTransferAudit(job: Job<CreditTransferJob>) {
        const { fromUserId, toUserId, amount, timestamp } = job.data;
        console.log(`[AUDIT] Transfer of ${amount} credits from ${fromUserId} to ${toUserId} at ${timestamp}`);

        // Optionally save to database, external system, or file
    }
}
