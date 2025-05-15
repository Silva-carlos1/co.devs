import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CredentialsLoginDto } from './dto/login-credentials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.usersService.create(createUserDto);

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(
    @Body() credentialsLoginDto: CredentialsLoginDto,
    @Request() req,
  ) {
    return await this.authService.login(req.user);
  }
}
