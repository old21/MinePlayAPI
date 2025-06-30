import { Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { ServersService } from './servers.service';
import { Response } from 'express';

@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Get('/')
  async getAll(@Res() res: Response) {
    const servers = await this.serversService.getIndex();
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: servers });
  }

  @Get('/summaryOnline')
  async getSummaryOnline(@Res() res: Response) {
    const online = await this.serversService.getSummaryOnline();
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: { online: online } });
  }

  @Post('/create')
  async create(@Res() res: Response) {
    const online = await this.serversService.getSummaryOnline();
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: { online: online } });
  }

  // @Get('monitoring')
  // async getProfile(@Req() request, @Body() dto: CreateNewDto) {
  //     const user = await this.usersService.getById(request.user.id);
  //     return await this.newsService.create(dto, user);
  // }
}
