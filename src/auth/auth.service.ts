import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CredentialsLoginDto } from './dto/login-credentials.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: User) {
    return this.generateJwtToken(user);
  }

  async validateUserCredentials(credentialsLogin: CredentialsLoginDto) {
    const user = await this.usersService.findByEmail(credentialsLogin.email);
    if (user && (await compare(credentialsLogin.password, user.password))) {
      return {
        ...user,
        password: undefined,
      };
    }

    throw new UnauthorizedException('Invalid password');
  }

  async generateJwtToken(user: User) {
    const payload = {
      username: user.email,
      sub: user.id,
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
      authTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_SECRET_KEY,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.REFRESH_SECRET_KEY,
        }),
      },
    };
  }
}
