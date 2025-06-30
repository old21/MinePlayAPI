import { WalletsService } from './../../wallets/wallets.service';
import { UsersService } from './../users.service';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from 'src/services/storage.service';

import { Texture } from './textures.types';

import { Avatar } from 'src/helpers/avatar.helper';
import { UploadSkinDto } from './dto/upload-skin.dto';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { SetSkinDto } from './dto/set-skin.dto';
import { Textures } from './textures.entity';
import { UploadCloakDto } from './dto/upload-cloak.dto';
import Jimp from 'jimp';
import { Bills } from '../../wallets/wallets.types';
import { ShopService } from '../../shop/shop.service';
import { ServiceKeys } from '../../shop/shop.types';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';

@Injectable()
export class TexturesService {
  private readonly logger = new Logger(TexturesService.name);
  constructor(
    private storageService: StorageService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private walletsService: WalletsService,
    @InjectRepository(Textures)
    private texturesRepository: Repository<Textures>,
    private subscriptionsService: SubscriptionsService,
    private shopService: ShopService,
  ) {}

  async getUserSkin(user: User): Promise<Texture> {
    let url, type, assetType;
    switch (user.skin) {
      case 0:
        assetType = 0;
        url = this.storageService.get(process.env.SKIN_DEFAULT_URI);
        type = process.env.SKIN_DEFAULT_TYPE;
        break;
      case 1:
        assetType = 1;
        url = this.storageService.get(`/users/${user.id}/skins/skin.png`);
        type = 'default';
        break;
      case 2:
        assetType = 2;
        url = this.storageService.get(`/users/${user.id}/skins/skin.png`);
        type = 'default';
        break;
      case 3:
        assetType = 3;
        const skin = await this.texturesRepository.findOne({
          where: { id: user.params.skin, textureType: 0 },
        });
        url = this.storageService.get(
          `${process.env.TEXTURES_LIBRARY_SKINS_PATH}/${skin.id}.png`,
        );
        type = skin.params;
        break;
    }
    return { url, type, assetType };
  }

  async getUserCloak(user: User): Promise<Texture | null> {
    let url, assetType;
    switch (user.cloak) {
      case 0:
        assetType = 0;
        return null;
      case 1:
        assetType = 1;
        url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
        break;
      case 2:
        assetType = 2;
        url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
        break;
      case 3:
        assetType = 3;
        url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
        break;
    }
    return { url, assetType };
  }

  async getUserAvatar(user: User, skinBase64: string = null): Promise<Texture> {
    let url, assetType, image, skin;
    switch (user.avatar) {
      case 0:
        assetType = 0;
        skin = await this.getUserSkin(user);
        if (skinBase64 != null) {
          image = await Avatar.classic(`data:image/png;base64,${skinBase64}`);
        } else {
          image = await Avatar.classic(skin.url);
        }
        return { assetType: assetType, image: image };
      case 1:
        assetType = 1;
        url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
        break;
      case 2:
        assetType = 2;
        url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
        break;
      case 3:
        assetType = 0;
        skin = await this.getUserSkin(user);
        image = await Avatar.classic(skin.url);
        return { assetType: assetType, image: image };
    }
    return { url, assetType };
  }

  async getUserBanner(user: User): Promise<Texture | boolean | string> {
    let url, assetType;
    switch (user.banner) {
      case 0:
        return { assetType: 0, color: user.params.banner };
      case 1:
        assetType = 1;
        url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
        break;
      case 2:
        assetType = 2;
        url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
        break;
      case 3:
        assetType = 3;
        url = this.storageService.get(`/users/${user.id}/cloaks/cloak.png`);
        break;
    }
    return { url, assetType };
  }

  async uploadUserCloak(user: User, dto: UploadCloakDto): Promise<Texture> {
    const subscriptions =
      await this.subscriptionsService.getUserActiveSubscription(user);
    const metadata = await Jimp.read(dto.file.buffer);

    if (!subscriptions) {
      if (metadata.bitmap.width > 64 || metadata.bitmap.height > 64) {
        let hdCloakService = await this.shopService.getShopService(
          ServiceKeys.HDCLOAK,
        );
        if (!hdCloakService) {
          this.logger.warn(
            'Сервисный предмет "HD плащ" не определен в магазине! Предмет создан автоматически.',
          );
          hdCloakService = await this.shopService.addShopService(
            ServiceKeys.CLOAK,
            Number(process.env.DEFAULT_HDCLOAK_COST),
          );
        }
        await this.walletsService.purchase(user, Bills.MONEY, hdCloakService);
      } else {
        let cloakService = await this.shopService.getShopService(
          ServiceKeys.CLOAK,
        );
        if (!cloakService) {
          this.logger.warn(
            'Сервисный предмет "Плащ" не определен в магазине! Предмет создан автоматически.',
          );
          cloakService = await this.shopService.addShopService(
            ServiceKeys.CLOAK,
            Number(process.env.DEFAULT_CLOAK_COST),
          );
        }
        await this.walletsService.purchase(user, Bills.MONEY, cloakService);
      }
    }
    const url: string | boolean = await this.storageService.upload(
      dto.file,
      `/users/${user.id}/cloaks`,
      'cloak.png',
    );
    this.usersService.setCloak(user, 1);

    return { assetType: 1, url };
  }

  async uploadUserSkin(user: User, dto: UploadSkinDto): Promise<Texture> {
    const subscriptions =
      await this.subscriptionsService.getUserActiveSubscription(user);
    const metadata = await Jimp.read(dto.file.buffer);

    if (
      !subscriptions &&
      (metadata.bitmap.width > 64 || metadata.bitmap.height > 64)
    ) {
      let hdSkinService = await this.shopService.getShopService(
        ServiceKeys.HDSKIN,
      );
      if (!hdSkinService) {
        this.logger.warn(
          'Сервисный предмет "HD скин" не определен в магазине! Предмет был создан автоматически.',
        );
        hdSkinService = await this.shopService.addShopService(
          ServiceKeys.HDSKIN,
          Number(process.env.DEFAULT_HDSKIN_COST),
        );
      }
      await this.walletsService.purchase(user, Bills.MONEY, hdSkinService);
    }
    const url: string | boolean = await this.storageService.upload(
      dto.file,
      `/users/${user.id}/skins`,
      'skin.png',
    );
    if (dto.type != 'slim' && dto.type != 'default') {
      throw new BadRequestException(4101, 'Invalid skin type.');
    }
    this.usersService.setSkin(user, 1);
    if (user.avatar == 0) {
      const avatar = await this.getUserAvatar(
        user,
        dto.file.buffer.toString('base64'),
      );
      return { assetType: 1, url, type: dto.type, etc: { avatar: avatar } };
    }
    return { assetType: 1, url, type: dto.type };
  }

  async setUserSkin(user: User, dto: SetSkinDto): Promise<Texture> {
    const skin = await this.texturesRepository.findOne({
      where: { id: dto.skinId, textureType: 0 },
    });
    if (!skin) {
      throw new BadRequestException(
        4101,
        'Texture with current ID is not found.',
      );
    }
    this.usersService.setSkin(user, 3, dto.skinId);
    if (user.avatar == 0) {
      const avatar = await this.getUserAvatar(user);
      return {
        assetType: 3,
        url: this.storageService.get(
          `${process.env.TEXTURES_LIBRARY_SKINS_PATH}/${dto.skinId}.png`,
        ),
        type: skin.params,
        etc: { avatar: avatar },
      };
    }

    return {
      assetType: 3,
      url: this.storageService.get(
        `${process.env.TEXTURES_LIBRARY_SKINS_PATH}/${dto.skinId}.png`,
      ),
      type: skin.params,
    };
  }

  async getLibrarySkins(): Promise<Textures[]> {
    const skins = await this.texturesRepository.find({
      where: { textureType: 0 },
      select: ['id', 'params', 'name'],
    });
    for (let i = 0; i < skins.length; i++) {
      skins[i].texture = {
        assetType: 3,
        url: this.storageService.get(
          `${process.env.TEXTURES_LIBRARY_SKINS_PATH}/${skins[i].id}.png`,
        ),
        type: skins[i].params,
      };
      delete skins[i].params;
    }

    return skins;
  }
}
