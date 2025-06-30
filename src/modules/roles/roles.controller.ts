import { UsersService } from '../users/users.service';
import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private usersService: UsersService,
  ) {}

  @Post('/create')
  @FormDataRequest()
  async create(@Body() dto: CreateRoleDto, @Res() res: Response) {
    const role = await this.rolesService.create(dto);

    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        id: role.id,
        name: role.name,
        slug: role.slug,
        prefix: role.prefix,
        colors: {
          prefix: role.prefixColor,
          nick: role.nickColor,
          message: role.messageColor,
        },
        isDefault: role.isDefault,
        isDonate: role.isDonate,
        needForEquip: role.needForEquip,
        assets: role.assets,
      },
    });
  }

  @Get('/donate')
  async getDonateRoles(@Res() res: Response) {
    const roles = await this.rolesService.getDonate();
    const data = [];
    for (let i = 0; i < roles.length; i++) {
      data.push({
        id: roles[i].id,
        name: roles[i].name,
        slug: roles[i].slug,
        prefix: roles[i].prefix,
        colors: {
          prefix: roles[i].prefixColor,
          nick: roles[i].nickColor,
          message: roles[i].messageColor,
        },
        isDefault: roles[i].isDefault,
        isDonate: roles[i].isDonate,
        needForEquip: roles[i].needForEquip,
        assets: roles[i].assets,
      });
    }

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data });
  }
}
