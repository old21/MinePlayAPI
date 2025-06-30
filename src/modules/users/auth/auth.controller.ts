import {
  Body,
  Controller,
  Post,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
  Query,
  Param,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { ReferalsService } from 'src/modules/referals/referals.service';
import { OTPProviders } from '../OTP/otp.types';
import { AuthGateway } from "./auth.gateway";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private referalsService: ReferalsService,
    private authGateway: AuthGateway,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards()
  @Post('login')
  async login(
    @Headers('otpcode') otpCode: string,
    @Headers('otptype') otpType: string,
    @Req() request,
    @Body() dto: LoginUserDto,
  ) {
    const user = await this.authService.login(
      dto.login,
      dto.password,
      Number(otpType) as OTPProviders,
      otpCode,
    );
    return this.authService.respondWithToken(user, request);
  }

  @Get('login/:provider')
  async getOauthURL(
    @Res() res: Response,
    @Param('provider') provider,
    @Query('clientId') clientId: string,
  ) {
    const redirectUrl = await this.authService.getRedirectURL(
      provider,
      clientId,
    );
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: { redirectUrl } });
  }

  @Get('login/:provider/callback')
  async getOauthCallback(
    @Query() query,
    @Param('provider') provider,
    @Req() request,
  ) {
    const callback = await this.authService.callback(provider, query);
    const response = await this.authService.respondWithToken(callback, request);
    this.authGateway.sendSocialAuthData(query.state, response.data);
  }

  @Throttle({ default: { limit: 3, ttl: 15000 } })
  @Post('register')
  async register(@Req() request, @Body() dto: RegisterUserDto) {
    let referal = null;
    if (dto.invitedBy != null) {
      referal = await this.referalsService.getByName(dto.invitedBy);
      if (!referal) {
        //throw new BadRequestException(4103, "Referal not found");
        referal = null;
      } else {
        this.referalsService.addInvite(referal);
      }
    }
    const user = await this.authService.register(
      dto.name,
      dto.email,
      dto.password,
      referal,
    );
    return this.authService.respondWithToken(user, request);
  }

  @Post('register/checkAvailability/email')
  async checkEmailAvailability(@Res() res: Response, @Body() body) {
    const availability = await this.authService.checkEmailAvailability(
      body.email,
    );
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: { available: availability } });
  }

  @Post('register/checkAvailability/name')
  async checkNameAvailability(@Res() res: Response, @Body() body) {
    const availability = await this.authService.checkNameAvailability(
      body.name,
    );
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, data: { available: availability } });
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() request, @Res() res: Response) {
    this.authService.logout(request.user.id, request.user.session);

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK });
  }
}
