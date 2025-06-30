import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bonus } from './bonus.enitity';

@Injectable()
export class BonusesService {
  constructor(
    @InjectRepository(Bonus)
    private bonusesRepository: Repository<Bonus>,
  ) {}

  async getBonus(email: string): Promise<Bonus[]> {
    return await this.bonusesRepository.find({ where: { email } });
  }
}
