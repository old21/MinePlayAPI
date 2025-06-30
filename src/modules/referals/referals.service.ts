import { UsersService } from "src/modules/users/users.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Referal } from "./referals.entity";
import { User } from "../users/users.entity";
import { ReferalsLevelsService } from "./levels/referals.levels.service";
import { isUUID } from "src/helpers/language.helper";
import { WalletsService } from "../wallets/wallets.service";
import { ReplenishTypes } from "../wallets/wallets.types";

@Injectable()
export class ReferalsService {
  constructor(
    @InjectRepository(Referal) private referalsRepository: Repository<Referal>,
    private referalsLevelsService: ReferalsLevelsService,
    @Inject(forwardRef(() => WalletsService))
    private walletsService: WalletsService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async register(user: User): Promise<Referal> {
    const referal = await this.referalsRepository.create({ user });
    referal.level = await this.referalsLevelsService.getFirstLevel();
    return await this.referalsRepository.save(referal);
  }

  async getByUser(user: User): Promise<Referal> {
    const referal = await this.referalsRepository.findOne({ where: { user } });
    if (referal) {
      referal.level = await this.referalsLevelsService.getByReferal(referal);
      if (!referal.isVip) {
        delete referal.vipName;
      }
    }

    return referal;
  }

  async getByName(name: string, select = null): Promise<Referal> {
    let referal;
    if (isUUID(name)) {
      referal = await this.referalsRepository.findOne({
        where: { id: name },
        select: select,
      });
    } else {
      referal = await this.referalsRepository.findOne({
        where: { vipName: name },
        select: select,
      });
    }
    if (!referal) {
      return referal;
    }

    if (!referal.isVip) {
      delete referal.vipName;
    }

    return referal;
  }

  async addInvite(referal: Referal): Promise<Referal> {
    referal.used += 1;
    return await this.referalsRepository.save(referal);
  }

  async addMoney(referal: Referal, amount: number): Promise<Referal> {
    const level = await this.referalsLevelsService.getByReferal(referal);
    const user = await this.usersService.getByReferal(referal);
    referal.earned += Math.round((amount * level.percents) / 100);
    this.walletsService.replenish(
      user,
      Math.round((amount * level.percents) / 100),
      ReplenishTypes.REFERRAL,
    );

    return this.referalsRepository.save(referal);
  }
}
