import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RolesService } from '../roles/roles.service';
import * as argon2 from 'argon2';
import { Referal } from '../referals/referals.entity';
import { News } from '../news/news.entity';
import { Role } from '../roles/roles.entity';
import { SessionsService } from './sessions/sessions.service';
import { TexturesService } from './textures/textures.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,
    private sessionsService: SessionsService,
    @Inject(forwardRef(() => TexturesService))
    private texturesService: TexturesService,
  ) {}

  async create(dto: RegisterUserDto, invitedBy = null): Promise<User> {
    const role = await this.rolesService.getDefault();
    const user = await this.userRepository.create({
      ...dto,
      role,
      invitedBy,
    });
    return await this.userRepository.save(user);
  }
  async emailConfirm(user: User) {
    user.isEmailConfirmed = true;
    this.userRepository.save(user);
    return user;
  }
  async getByName(login: string, select = null): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { name: login },
      select: select,
    });
  }

  async getByEmail(email: string, select = null): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email },
      select,
    });
  }

  async getByLogin(login: string, select = null): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: [{ name: login }, { email: login }],
      select: select,
    });
  }

  async getByReferal(
    referal: Referal,
    select = null,
  ): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { referal },
      select: select,
    });
  }

  async getById(id: string, select = null, options = null): Promise<User> {
    if (select) {
      return await this.userRepository.findOne({
        where: { id },
        select,
        ...options,
      });
    }
    return await this.userRepository.findOne({ where: { id }, ...options });
  }

  async findLikeName(
    namePeace: string,
    select = null,
    options = null,
  ): Promise<User[]> {
    if (select) {
      return await this.userRepository.find({
        where: { name: ILike(`%${namePeace}%`) },
        select,
        ...options,
      });
    }
    return await this.userRepository.find({
      where: { name: ILike(`%${namePeace}%`) },
      ...options,
    });
  }

  async setSkin(
    user: User,
    skinType: number,
    skinID: string = null,
  ): Promise<User> {
    user.skin = skinType;

    if (skinType === 3) {
      user.params.skin = skinID;
    }
    return await this.userRepository.save(user);
  }

  async setCloak(user: User, cloakType: number): Promise<User> {
    user.cloak = cloakType;
    return await this.userRepository.save(user);
  }

  async setServer(user: User, serverId: string): Promise<User> {
    user.serverId = serverId;
    return await this.userRepository.save(user);
  }

  async changePassword(user: User, password: string): Promise<User> {
    user.password = await argon2.hash(password);
    user.passwordReset_at = Math.floor(Date.now() / 1000);
    await this.sessionsService.destroyAll(user);
    return await this.userRepository.save(user);
  }

  async changeEmail(user: User, email: string): Promise<User> {
    await this.sessionsService.destroyAll(user);
    user.email = email;
    return await this.userRepository.save(user);
  }

  async addLike(user: User, newItem: News) {
    user.likes = [newItem];
    return await this.userRepository.save(user);
  }

  async removeLike(user: User, newItem: News) {
    user.likes = user.likes.filter((item) => {
      return item.id !== newItem.id;
    });
    return await this.userRepository.save(user);
  }

  async setRole(user: User, role: Role): Promise<User> {
    user.role = role;
    return await this.userRepository.save(user);
  }

  async getAssets(user: User) {
    const avatar = await this.texturesService.getUserAvatar(user);
    const userSpecial = await Promise.all([
      this.texturesService.getUserSkin(user),
      this.texturesService.getUserCloak(user),
      this.texturesService.getUserBanner(user),
    ]);

    return {
      avatar,
      skin: userSpecial[0],
      cloak: userSpecial[1],
      banner: userSpecial[2],
    };
  }
}
