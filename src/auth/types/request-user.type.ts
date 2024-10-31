import { UserResponseDto } from 'src/user/dto/user.response';

export type RequestUser = UserResponseDto & {
  refreshToken?: string; // Add any optional properties here
};
