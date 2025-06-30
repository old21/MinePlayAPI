import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Referal } from '../referals.entity';
import { User } from 'src/modules/users/users.entity';
import { Referal_level } from './referals.levels.entity';


@Injectable()
export class ReferalsLevelsService {
    constructor(@InjectRepository(Referal_level) private referalLevelsRepository: Repository<Referal_level>) {}

    async getFirstLevel(isVip: boolean = false): Promise<Referal_level>{
        let level = await this.referalLevelsRepository.findOne({ where: { needToUse: 0 } });
        if(!level) {
            level = await this.referalLevelsRepository.save(await this.referalLevelsRepository.create({ displayName: "Новичёк", needToUse: 0, percents: 2, isVip: isVip }));
        }
        return level;
    }
    async getByReferal(referal: Referal, isVip: boolean = false): Promise<Referal_level> {
        let level = await this.referalLevelsRepository.findOne({ order: { needToUse: { direction: "DESC" } }, where: { needToUse: MoreThanOrEqual(referal.used), isVip: isVip } });
        if(!level) {
            level = await this.referalLevelsRepository.save(await this.referalLevelsRepository.create({ displayName: "Новичёк", needToUse: 0, percents: 2, isVip: isVip }));
        }
        return level;
    }
    // async getByUser(user: User): Promise<Referal> {
    //     return await this.referalsRepository.findOne({ where: { user } });
    // }
}