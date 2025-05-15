import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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
