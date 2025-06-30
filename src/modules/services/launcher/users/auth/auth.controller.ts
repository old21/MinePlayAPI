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
import { AuthorizeDto } from './dto/authorize.dto';
import { AuthService } from './auth.service';
import { TokenGuard } from 'src/guards/token.guard';
import { Token } from 'src/decorators/token.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JoinServerDto } from './dto/join-server.dto';
import { Request } from 'express';
import { CheckServerDto } from './dto/check-server.dto';

@Controller('launcher/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/')
  @UseGuards(TokenGuard)
  @Token(process.env.LAUNCHER_TOKEN)
  async authorize(@Body() dto: AuthorizeDto, @Res() res: Response) {
    const authReport = await this.authService.authorize(dto);
    console.log(authReport.session.user.assets);
    res.status(HttpStatus.OK).json(authReport);
  }

  @Post('/refresh')
  @UseGuards(TokenGuard)
  @Token(process.env.LAUNCHER_TOKEN)
  async refresh(@Body() dto: RefreshTokenDto, @Res() res: Response) {
    const authReport = await this.authService.refresh(dto);
    res.status(HttpStatus.OK).json(authReport);
  }

  @Post('/joinServer')
  @UseGuards(TokenGuard)
  @Token(process.env.LAUNCHER_TOKEN)
  async joinServer(@Body() dto: JoinServerDto, @Res() res: Response) {
    console.log(dto);
    await this.authService.joinServer(dto);
    res.status(HttpStatus.OK).json({ status: 200 });
  }

  @Post('/checkServer')
  @UseGuards(TokenGuard)
  @Token(process.env.LAUNCHER_TOKEN)
  async checkServer(@Body() dto: CheckServerDto, @Res() res: Response) {
    const HttpUser = await this.authService.checkServer(dto);
    res.status(HttpStatus.OK).json(HttpUser);
  }

  @Get('/current')
  async current(@Res() res: Response, @Req() request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    const accessToken = type === 'Bearer' ? token : undefined;

    const HttpUserSession = await this.authService.getByToken(accessToken);
    console.log(HttpUserSession);
    res.status(HttpStatus.OK).json(HttpUserSession);
  }

  @Get('/details')
  async details(@Res() res: Response, @Req() request: Request) {
    res.status(HttpStatus.OK).json({
      details: [
        {
          type: 'password',
        },
      ],
    });
  }
}
