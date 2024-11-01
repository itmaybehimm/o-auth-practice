// local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegistrationMethod } from 'src/enums/users/registration-method.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    // Define fields to be used for login, like 'username' and 'password'
    super({ usernameField: 'email' });
  }

  // adds request.user the return value
  async validate(email: string, password: string) {
    const user = await this.userService.findOne({ email });

    if (user.registrationMethod != RegistrationMethod.LOCAL) {
      throw new UnauthorizedException(
        'This user was registered using an external provider',
      );
    }

    const userDocument = await this.userService.validateUser(email, password);

    const userResponse = await this.userService.mapToUserResponse(userDocument);

    return { ...userResponse };
  }
}
