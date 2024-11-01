import { IsEnum, IsString, MinLength } from 'class-validator';
import { RegistrationMethod } from 'src/enums/users/registration-method.enum';

export class RegisterUserDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class RegisterUserOAuthDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  email: string;

  @IsEnum(RegistrationMethod, {
    message: `Registration method must be one of the following: ${Object.values(RegistrationMethod).join(', ')}`,
  })
  registrationMethod: RegistrationMethod = RegistrationMethod.GOOGLE; // Default to GOOGLE for OAuth
}
