import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RequestUser } from 'src/auth/types/request-user.type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async generateTokens(
    user: RequestUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { username: user.username, sub: user._id };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRY'), // Refresh token expiration time
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }

  async login(
    user: RequestUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.generateTokens(user);

    // Store the refresh token securely (optionally hashed) in the database
    await this.userService.update({
      username: user.username,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async refresh(
    user: RequestUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userDb = await this.userService.findOne({
      username: user.username,
    });

    if (userDb.refreshToken !== user.refreshToken) {
      throw new UnauthorizedException();
    }

    const newTokens = await this.generateTokens(user);

    // Update the refresh token in the database
    await this.userService.update({
      username: user.username,
      refreshToken: newTokens.refreshToken,
    });

    return newTokens;
  }

  // Logout method to remove the stored refresh token
  async logout(user: RequestUser): Promise<void> {
    await this.userService.update({
      username: user.username,
      refreshToken: null,
    });
  }
}
