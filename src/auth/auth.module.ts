import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './stratergy/local.stratergy';
import { JwtStrategy } from './stratergy/jwt.stratergy';
import { JwtRefreshStrategy } from './stratergy/jwt-refresh.stratergy';
import { GoogleStrategy } from './stratergy/google.strategy';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule to handle environment variables
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to make ConfigService available
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Access JWT secret from environment variable
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') }, // Set token expiration for access tokens here
      }),
      inject: [ConfigService], // Inject ConfigService for dynamic configuration
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
