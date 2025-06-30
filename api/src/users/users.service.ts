import { Injectable, Inject } from '@nestjs/common';
import { User } from './entities/user.entity';
import { IUserRepository } from './repositories/user.repository.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findById(id);
  }

  async create(userData: {
    email: string;
    password: string;
    name: string;
    location: string;
    isVerified?: boolean;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser: User = {
      id: `USER${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      reputation: 4.5,
      location: userData.location,
      salesCount: 0,
      joinDate: new Date(),
      isVerified: userData.isVerified ?? false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.userRepository.create(newUser);
  }

  async incrementSalesCount(id: string): Promise<boolean> {
    return await this.userRepository.incrementSalesCount(id);
  }
} 