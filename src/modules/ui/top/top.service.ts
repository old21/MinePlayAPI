import { Injectable } from '@nestjs/common';
import { TopBlock } from './top.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTopDto } from './dto/create-top.dto';

import { StorageService } from 'src/services/storage.service'

@Injectable()
export class TopService {
    constructor(@InjectRepository(TopBlock) private topRepository: Repository<TopBlock>,
                                            private storageService: StorageService) {}
    async add(dto: CreateTopDto): Promise<TopBlock> {
        // Find active top block and deactivate it
        const activeTop = await this.findActive();
        if(activeTop) {
            activeTop.isActive = false;
            this.topRepository.update(activeTop.id, activeTop);
        }

        //Create a new top block
        const topEntity = await this.topRepository.create(dto);
        const top = await this.topRepository.save(topEntity)
        //add a assets with multithread
        const backgroundPath = this.storageService.upload(dto.background, '/ui/top/backgrounds', `${top.id}.png`);
        const renderPath = this.storageService.upload(dto.render, '/ui/top/renders', `${top.id}.png`);

        const storage = await Promise.all([backgroundPath, renderPath]);
        top.background = storage[0];
        top.render = storage[1];
        return top;
    }
    async findActive(): Promise<TopBlock> {
        const active = await this.topRepository.findOne({ where: { isActive: true } });
        if(active){
            return {
                ...active,
                render: this.storageService.get(`/ui/top/renders/${active.id}.png`),
                background: this.storageService.get(`/ui/top/backgrounds/${active.id}.png`)
            }
        }
    }
    findAll(): Promise<TopBlock[]> {
        return this.topRepository.find();
    }
}
