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
    
    // Generate random reputation between 1.0 and 5.0
    const randomReputation = Math.round((Math.random() * 4 + 1) * 10) / 10;
    
    // Generate unique user ID
    const allUsers = await this.userRepository.findAll();
    const userIdNumber = allUsers.length + 1;
    
    const newUser: User = {
      id: `SELLER${String(userIdNumber).padStart(3, '0')}`,
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      reputation: randomReputation,
      location: userData.location,
      salesCount: 0,
      joinDate: new Date(),
      isVerified: userData.isVerified || false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.userRepository.create(newUser);
  }

  // Método para obtener información del seller (sin password)
  async getSellerInfo(id: string) {
    const user = await this.findById(id);
    if (!user) return null;

    const { password, ...sellerInfo } = user;
    return sellerInfo;
  }

  // Método para obtener todos los usuarios activos (sin passwords)
  async findAllActive(): Promise<Omit<User, 'password'>[]> {
    return await this.userRepository.findActiveUsers();
  }

  // Method to increment the sales count
  async incrementSalesCount(id: string): Promise<boolean> {
    return await this.userRepository.incrementSalesCount(id);
  }
} 