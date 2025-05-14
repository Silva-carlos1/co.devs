import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { sanitizeString } from 'src/common/utils/sanitize-username.util';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userName = sanitizeString(createUserDto.username);

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { username: userName }],
      },
    });

    if (user) throw new ConflictException('email or username duplicated');

    await this.prismaService.user.create({
      data: {
        username: userName,
        email: createUserDto.email,
        name: createUserDto.name,
        password: await hash(createUserDto.password, 10),
        created_at: new Date(),
      },
    });

    return;
  }
}
