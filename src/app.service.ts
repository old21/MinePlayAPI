import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SubscriptionsService } from './modules/subscriptions/subscriptions.service';
import { PersonalizeService } from './modules/personalize/personalize.service';
import { ServersService } from './modules/servers/servers.service';
import { NewsService } from './modules/news/news.service';
import { TexturesService } from './modules/users/textures/textures.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private subscriptionsService: SubscriptionsService,
    private personalizeService: PersonalizeService,
    private serversService: ServersService,
    private newsService: NewsService,
    private texturesService: TexturesService,
  ) {}
  async onApplicationBootstrap() {
    // const servicesList = [
    //   this.subscriptionsService,
    //   this.personalizeService,
    //   this.serversService,
    //   this.newsService,
    //   this.texturesService,
    // ];
    // const servicesData = await Promise.all(servicesList);
  }
}
