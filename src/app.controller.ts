import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/')
export class AppController {
  @Get('/')
  async getAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Welcome to Mine-Play.Ru public API!',
      docs: process.env.APP_DOCS_URL,
    });
  }
}
