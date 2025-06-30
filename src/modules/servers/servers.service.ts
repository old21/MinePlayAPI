import { Inject, Injectable } from '@nestjs/common';
import { status } from 'minecraft-server-util-dist';
import { Repository } from 'typeorm';
import { Server } from './servers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ServerStatus } from './servers.interfaces';

@Injectable()
export class ServersService {
    constructor(@InjectRepository(Server) private serversRepository: Repository<Server>,
                @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async getIndex(): Promise<Server[] | boolean> {
        const servers = await this.serversRepository.find({ where: { isIndex: true, isArchived: false } });
        if(servers){
            let serverStatusPromise = [];
            for(let i = 0; i < servers.length; i++){
                serverStatusPromise[i] = this.serverPing(servers[i].address, servers[i].slug);
            }
            let serverStatus = await Promise.all(serverStatusPromise);

            for(let i = 0; i < servers.length; i++){
                servers[i].status = serverStatus[i];
            }
            return servers;
        }
        return false;
    }
    async getSummaryOnline(): Promise<Number | boolean> {
        const servers = await this.serversRepository.find({ where: { isIndex: true, isArchived: false }, select: [ "slug", "address" ] });
        if(servers) {
            let summaryOnline = 0;
            let serverStatusPromise = [];
            
            for(let i = 0; i < servers.length; i++){
                serverStatusPromise[i] = this.serverPing(servers[i].address, servers[i].slug);
            }
            let serverStatus = await Promise.all(serverStatusPromise);

            for(let i = 0; i < servers.length; i++){
                summaryOnline += serverStatus[i].online;
            }

            return summaryOnline;
        }
        return false;
    }

    async serverPing(address: string, slug: string): Promise<ServerStatus> {
        let addressSplit = address.split(":");
        if(addressSplit[1] === undefined || addressSplit[1] === null || addressSplit[1] == 'NaN'){
            addressSplit[1] = "25565";
        }


        // Server get online and MAX players
        let online = this.cacheManager.get(`${slug}_online`);
        let max = this.cacheManager.get(`${slug}_max`);
        let serverInfo = await Promise.all([online, max]);

        if(serverInfo[0] === null || serverInfo[1] === null){
            try {
                let serverPing = await status(addressSplit[0], Number(addressSplit[1]));
                if(serverInfo[0] === null){
                    this.cacheManager.set(`${slug}_online`, serverPing.players.online, { ttl: 30 } as any);
                }
                if(serverInfo[1] === null){
                    this.cacheManager.set(`${slug}_max`, serverPing.players.max, { ttl: 3600 } as any);
                }

                return {
                    online: serverPing.players.online,
                    max: serverPing.players.max
                }
            } catch (e) {
                this.cacheManager.set(`${slug}_online`, -1, { ttl: 30 } as any);
                this.cacheManager.set(`${slug}_max`, -1, { ttl: 30 } as any);
                return {
                    online: -1,
                    max: -1
                }
            }
        } else {
            return {
                online: Number(serverInfo[0]),
                max: Number(serverInfo[1])
            }
        }
    }
}   