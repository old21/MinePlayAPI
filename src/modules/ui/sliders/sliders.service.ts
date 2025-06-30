import { Injectable } from '@nestjs/common';
import { Slider } from './sliders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSliderDto } from './dto/create-slider.dto';

import { StorageService } from 'src/services/storage.service'

@Injectable()
export class SlidersService {
    constructor(@InjectRepository(Slider) private sliderRepository: Repository<Slider>,
                                           private storageService: StorageService) {}
    async add(dto: CreateSliderDto): Promise<Slider> {
        const sliderEntity = await this.sliderRepository.create(dto);
        const slider = await this.sliderRepository.save(sliderEntity)
        const path = await this.storageService.upload(dto.background, '/ui/slider', `${slider.id}.png`);
        slider.image = path;
        return slider;
    }
    findAll(): Promise<Slider[]> {
        return this.sliderRepository.find();
    }
}
