import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { textToSlug } from 'src/helpers/language.helper';
import { PersonalizeRarity as Rarity } from './personalize.rarity.entity';
import { CreatePersonalizeRarityDto } from './dto/create-rarity.dto';
import { BadRequestException } from 'src/exceptions/BadRequestException';

@Injectable()
export class PersonalizeRarityService {
    constructor(@InjectRepository(Rarity) private rarityRepository: Repository<Rarity>) {}

    async getAll(): Promise<Rarity[]> {
        return await this.rarityRepository.find();
    }

    async getById(id: string): Promise<Rarity> {
        return await this.rarityRepository.findOne({ where: { id } });
    }

    async getByName(name: string): Promise<Rarity> {
        return await this.rarityRepository.findOne({ where: { name } });
    }

    async create(dto: CreatePersonalizeRarityDto): Promise<Rarity> {
        // const nameAvailabilityCheck = await this.getByName(dto.name);
        // if(nameAvailabilityCheck) {
        //     throw new BadRequestException(4101, 'Редкость с данным названием уже существует!');
        // }
        const slug = textToSlug(dto.name);
        const rarity = this.rarityRepository.create({
            ...dto, slug
        });
        return await this.rarityRepository.save(rarity);
    }
}