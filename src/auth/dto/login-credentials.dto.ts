import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CredentialsLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
