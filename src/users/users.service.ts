import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  // Mock users data - en una app real esto estaría en base de datos
  private users: User[] = [
    {
      id: 'SELLER001',
      email: 'tech@techstore.com',
      password: '$2a$10$8KjQZ3oGgHHWKZVKd8lELOGu3oGhOzD8V9mQkQo1VQ7QKjQZ3oGgH', // password123
      name: 'TechStore Premium',
      reputation: 4.8,
      location: 'Capital Federal, Buenos Aires',
      salesCount: 2847,
      joinDate: new Date('2018-03-15T00:00:00.000Z'),
      isVerified: true,
      isActive: true,
      createdAt: new Date('2018-03-15T00:00:00.000Z'),
      updatedAt: new Date('2018-03-15T00:00:00.000Z'),
    },
    {
      id: 'SELLER002',
      email: 'info@mobileworld.com',
      password: '$2a$10$8KjQZ3oGgHHWKZVKd8lELOGu3oGhOzD8V9mQkQo1VQ7QKjQZ3oGgH', // password123
      name: 'MobileWorld',
      reputation: 4.5,
      location: 'Córdoba, Córdoba',
      salesCount: 1256,
      joinDate: new Date('2019-07-22T00:00:00.000Z'),
      isVerified: true,
      isActive: true,
      createdAt: new Date('2019-07-22T00:00:00.000Z'),
      updatedAt: new Date('2019-07-22T00:00:00.000Z'),
    },
    {
      id: 'SELLER003',
      email: 'admin@compucenter.com',
      password: '$2a$10$8KjQZ3oGgHHWKZVKd8lELOGu3oGhOzD8V9mQkQo1VQ7QKjQZ3oGgH', // password123
      name: 'CompuCenter',
      reputation: 4.9,
      location: 'Rosario, Santa Fe',
      salesCount: 845,
      joinDate: new Date('2017-11-08T00:00:00.000Z'),
      isVerified: true,
      isActive: true,
      createdAt: new Date('2017-11-08T00:00:00.000Z'),
      updatedAt: new Date('2017-11-08T00:00:00.000Z'),
    },
  ];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email && user.isActive);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id && user.isActive);
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
      id: `SELLER${String(this.users.length + 1).padStart(3, '0')}`,
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      reputation: 0,
      location: userData.location,
      salesCount: 0,
      joinDate: new Date(),
      isVerified: userData.isVerified || false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  // Método para obtener información del seller (sin password)
  async getSellerInfo(id: string) {
    const user = await this.findById(id);
    if (!user) return null;

    const { password, ...sellerInfo } = user;
    return sellerInfo;
  }
} 