import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { TexturesService } from './textures.service';
import { AuthGuard, EmailConfirmedGuard } from '../auth/auth.guard';
import { UsersService } from '../users.service';
import { UploadSkinDto } from './dto/upload-skin.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { SetSkinDto } from './dto/set-skin.dto';
import { UploadCloakDto } from './dto/upload-cloak.dto';

@Controller('users/textures')
export class TexturesController {
  constructor(
    private texturesService: TexturesService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Post('/skin/upload')
  @FormDataRequest()
  async uploadSkin(
    @Req() request,
    @Res() res: Response,
    @Body() dto: UploadSkinDto,
  ) {
    const user = await this.usersService.getById(request.user.id, [
      'id',
      'skin',
      'avatar',
    ]);
    const skinUpload = await this.texturesService.uploadUserSkin(user, dto);
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: skinUpload });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Post('/cloak/upload')
  @FormDataRequest()
  async uploadCloak(
    @Req() request,
    @Res() res: Response,
    @Body() dto: UploadCloakDto,
  ) {
    const user = await this.usersService.getById(request.user.id, [
      'id',
      'cloak',
    ]);
    const cloakUpload = await this.texturesService.uploadUserCloak(user, dto);
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: cloakUpload });
  }

  @UseGuards(AuthGuard, EmailConfirmedGuard)
  @Post('/skin/set')
  async setSkin(@Req() request, @Res() res: Response, @Body() dto: SetSkinDto) {
    const user = await this.usersService.getById(request.user.id, [
      'id',
      'skin',
      'avatar',
    ]);
    const skinSet = await this.texturesService.setUserSkin(user, dto);
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: skinSet });
  }

  @Get('/library/skins')
  async getLibrarySkins(@Res() res: Response) {
    const skins = await this.texturesService.getLibrarySkins();
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: skins });
  }
}
