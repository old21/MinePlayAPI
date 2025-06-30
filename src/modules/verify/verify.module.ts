import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Confirmation } from './verify.entity';
import { VerifyService } from './verify.service';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [],
  providers: [VerifyService],
  exports: [VerifyService],
  imports: [
    TypeOrmModule.forFeature([Confirmation]),
    BullModule.registerQueue({
      name: 'emailSendings',
    }),
  ],
})
export class VerifyModule {}
