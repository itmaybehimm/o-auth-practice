import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user.response';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({
      username: registerUserDto.username,
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = await this.userModel.create(registerUserDto);
    return this.mapToUserResponse(createdUser); // Using mapToUserResponse to transform the response
  }

  async update(user: Partial<User>): Promise<UserDocument> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { username: user.username }, // Find user by username
      user, // Update with new user data
      { new: true, useFindAndModify: false }, // Options: return the updated document
    );

    // Handle case where user is not found
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async findOne(filter: Partial<User>): Promise<UserDocument | undefined> {
    return await this.userModel.findOne(filter);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.findOne({ username });

    if (!user || password !== user.password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.mapToUserResponse(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find(); // Fetch all users from the database

    const userResponses = await Promise.all(
      users.map((user) => this.mapToUserResponse(user)),
    );

    return userResponses; // Return the array of UserResponseDto
  }

  async mapToUserResponse(user: UserDocument): Promise<UserResponseDto> {
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
