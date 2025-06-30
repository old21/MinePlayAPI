import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrestarterService } from './prestarter.service';
import { PrestarterInitDto } from './dto/init.dto';
import { OSNotSupportedException } from './prestarter.exceptions';

@Controller('launcher/prestarter')
export class PrestarterController {
  constructor(private prestarterService: PrestarterService) {}

  @Post('init')
  async getUserByUsername(
    @Res() res: Response,
    @Body() dto: PrestarterInitDto,
  ) {
    if (dto.os != 'win32' && dto.os != 'darwin' && dto.os != 'linux') {
      throw new OSNotSupportedException();
    }

    const javaURL = this.prestarterService.getJava(dto);
    const jcefNativesURL = this.prestarterService.getJCEFNatives(dto);
    const nativesURL = this.prestarterService.getNatives(dto);
    const launcherURL = process.env.LAUNCHER_URL + '/Launcher.jar';
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { javaURL, launcherURL, nativesURL, jcefNativesURL },
    });
  }
}
