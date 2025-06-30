import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Role, RoleAssets } from './roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { User } from '../users/users.entity';
import { textToSlug } from 'src/helpers/language.helper';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { UsersService } from '../users/users.service';
import { StorageService } from '../../services/storage.service';

@Injectable()
export class RolesService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    private storageService: StorageService,
  ) {}

  async getDefault(): Promise<Role> {
    let role = await this.rolesRepository.findOne({
      where: { isDefault: true },
    });
    if (!role) {
      // <----- If default role not found
      role = await this.create({
        name: 'Игрок',
        prefix: null,
        permissions: '*',
        isDefault: true,
        prefixColor: null,
        nickColor: null,
        messageColor: null,
        isDonate: false,
      });
    }
    return role;
  }

  async getById(id): Promise<Role | undefined> {
    const role = await this.rolesRepository.findOne({ where: { id: id } });
    if (role) {
      role.assets = this.getAssets(role);
    }
    return role;
  }

  async getByUser(user: User): Promise<Role | undefined> {
    const role = await this.rolesRepository.findOne({ where: { users: user } });
    if (role) {
      role.assets = this.getAssets(role);
    }
    return role;
  }

  async getByName(name: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { name } });
    if (role) {
      role.assets = this.getAssets(role);
    }
    return role;
  }

  async getDonate(): Promise<Role[]> {
    const roles = await this.rolesRepository.find({
      where: { isDonate: true },
      order: {
        needForEquip: 'ASC',
      },
    });
    for (const key in roles) {
      roles[key].assets = this.getAssets(roles[key]);
    }

    return roles;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const checkAvailability = await this.getByName(dto.name);
    if (checkAvailability) {
      throw new BadRequestException(
        4101,
        'Role with current name already exists!',
      );
    }
    const slug = textToSlug(dto.name);
    const role = await this.rolesRepository.create({
      name: dto.name,
      prefix: dto.prefix,
      prefixColor: dto.prefixColor,
      nickColor: dto.nickColor,
      messageColor: dto.messageColor,
      isDefault: dto.isDefault,
      isDonate: dto.isDonate,
      permissions: dto.permissions,
      slug,
    });
    if (dto.isDonate) {
      if (!dto.cardFront) {
        throw new BadRequestException(
          4102,
          'Donate role requires cardFront property!',
        );
      }
      if (!dto.cardRear) {
        throw new BadRequestException(
          4102,
          'Donate role requires cardRear property!',
        );
      }

      if (!dto.needForEquip) {
        throw new BadRequestException(
          4102,
          'Donate role requires needForEquip property!',
        );
      }
      role.needForEquip = dto.needForEquip;
    }
    const roleObject = await this.rolesRepository.save(role);
    if (dto.isDonate) {
      const front = await this.storageService.upload(
        dto.cardFront,
        `/roles/${roleObject.id}/card`,
        `front.png`,
      );

      const rear = await this.storageService.upload(
        dto.cardRear,
        `/roles/${roleObject.id}/card`,
        `rear.png`,
      );

      role.assets = {
        card: {
          front,
          rear,
        },
        tag: {
          standart: null,
          plus: null,
        },
      };
    }

    if (dto.tagStandart) {
      role.assets.tag.standart = await this.storageService.upload(
        dto.tagStandart,
        `/roles/${roleObject.id}/tag`,
        `standart.png`,
      );
    }
    if (dto.tagPlus) {
      role.assets.tag.plus = await this.storageService.upload(
        dto.tagPlus,
        `/roles/${roleObject.id}/tag`,
        `plus.png`,
      );
    }
    roleObject.assets = this.getAssets(roleObject);
    return roleObject;
  }

  //Replenish level system
  async syncRoleWithWallet(user: User, maxMoney: number): Promise<Role> {
    const role = await this.getByUser(user);
    const currentRole = await this.rolesRepository.findOne({
      where: {
        needForEquip: LessThanOrEqual(maxMoney),
      },
      order: {
        needForEquip: 'DESC',
      },
    });
    if (currentRole && role.id !== currentRole.id) {
      await this.usersService.setRole(user, currentRole);
      currentRole.assets = this.getAssets(currentRole);
      return currentRole;
    }
    return null;
  }

  getAssets(role: Role): RoleAssets {
    const assets: RoleAssets = {
      card: {
        rear: null,
        front: null,
      },
      tag: {
        standart: null,
        plus: null,
      },
    };

    if (role.isDonate) {
      assets.card.front = this.storageService.get(
        `/roles/${role.id}/card/front.png`,
      );
      assets.card.rear = this.storageService.get(
        `/roles/${role.id}/card/rear.png`,
      );
    }

    if (!role.isDefault) {
      assets.tag.standart = this.storageService.get(
        `/roles/${role.id}/tag/standart.png`,
      );
      assets.tag.plus = this.storageService.get(
        `/roles/${role.id}/tag/plus.png`,
      );
    }

    return assets;
  }
}
