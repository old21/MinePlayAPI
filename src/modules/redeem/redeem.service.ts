import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedeemCode } from './redeem.entity';
import { CreateRedeemDto } from './dto/create-redeem.dto';
import { WalletsService } from '../wallets/wallets.service';
import { User } from '../users/users.entity';
import { Bills, ReplenishTypes } from '../wallets/wallets.types';
import { RedeemTypes } from './redeem.types';
import { Transaction } from '../wallets/transactions/transactions.entity';
import { BadRequestException } from '../../exceptions/BadRequestException';
import { generateRedeem } from '../../helpers/string.helper';

@Injectable()
export class RedeemService {
  constructor(
    @InjectRepository(RedeemCode)
    private redeemRepository: Repository<RedeemCode>,
    private walletsService: WalletsService,
  ) {}

  async create(
    user: User,
    dto: CreateRedeemDto,
  ): Promise<{ transaction: Transaction; redeem: RedeemCode }> {
    await this.walletsService.isEnough(user, Bills.MONEY, dto.value);
    const redeemObject = this.redeemRepository.create({
      owner: user,
      type: RedeemTypes.CASH,
      value: dto.value,
      isPlayer: true,
      code: generateRedeem(user.name),
    });
    const redeem = await this.redeemRepository.save(redeemObject);
    const transaction = await this.walletsService.createRedeem(
      user,
      dto.value,
      redeem,
    );
    return { redeem, transaction };
  }
  async getByUser(user: User): Promise<RedeemCode[]> {
    return await this.redeemRepository.find({ where: { owner: user } });
  }
  async useRedeem(user: User, redeem: RedeemCode) {
    if (redeem.isUsed) {
      throw new BadRequestException(4101, 'Redeem already used!');
    }
    redeem.isUsed = true;
    this.walletsService.replenish(
      user,
      redeem.value,
      ReplenishTypes.REDEEM,
      true,
    );
    this.redeemRepository.save(redeem);
  }
}
