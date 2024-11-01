import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/types/jwt.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts JWT from Authorization header
      ignoreExpiration: false, // Do not ignore expiration
      secretOrKey: configService.get('JWT_SECRET') || 'defaultSecret', // Use the same secret
    });
  }

  // adds request.user the return value
  async validate(payload: JwtPayload) {
    const userDocument = await this.userService.findOne({
      email: payload.email,
    });
    const user = await this.userService.mapToUserResponse(userDocument);
    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }
    return { ...user };
  }
}
