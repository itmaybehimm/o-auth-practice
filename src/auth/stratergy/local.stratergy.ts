// local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    // Define fields to be used for login, like 'username' and 'password'
    super();
  }

  // adds request.user the return value
  async validate(username: string, password: string) {
    const user = await this.userService.validateUser(username, password);
    return { ...user };
  }
}
