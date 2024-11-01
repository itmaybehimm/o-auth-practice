import { Types } from 'mongoose';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  _id: Types.ObjectId;

  @Expose()
  email: string;
}
