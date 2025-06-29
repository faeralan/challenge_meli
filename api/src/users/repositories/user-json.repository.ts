import { Injectable, ConflictException } from '@nestjs/common';
import { BaseJsonRepository } from '../../common/repositories/base-json.repository';
import { IUserRepository } from './user.repository.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UserJsonRepository extends BaseJsonRepository<User> implements IUserRepository {
  protected readonly fileName = 'users.json';

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.loadData();
    return users.find(user => user.email === email && user.isActive) || null;
  }

  async findActiveUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.loadData();
    return users
      .filter(user => user.isActive)
      .map(({ password, ...user }) => user);
  }

  async incrementSalesCount(id: string): Promise<boolean> {
    try {
      const user = await this.findById(id);
      if (!user || !user.isActive) {
        return false;
      }

      await this.update(id, {
        salesCount: user.salesCount + 1,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  // Override the base findById to filter active users
  async findById(id: string): Promise<User | null> {
    const users = await this.loadData();
    return users.find(user => user.id === id && user.isActive) || null;
  }

  // Override to ensure proper user data structure
  async create(userData: User): Promise<User> {
    const users = await this.loadData();
    
    // Check if user with same email already exists
    if (users.some(user => user.email === userData.email)) {
      throw new ConflictException(`User with email ${userData.email} already exists`);
    }

    const newUser: User = {
      ...userData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    await this.saveData(users);
    
    return newUser;
  }
} 