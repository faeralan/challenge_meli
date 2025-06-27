import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'users.json');

  private async loadUsers(): Promise<User[]> {
    try {
      if (!fs.existsSync(this.dataPath)) {
        // Create directory and file if it doesn't exist
        const dataDir = path.dirname(this.dataPath);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2));
        return [];
      }

      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error loading users: ${error.message}`);
    }
  }

  private async saveUsers(users: User[]): Promise<void> {
    try {
      const dataDir = path.dirname(this.dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(this.dataPath, JSON.stringify(users, null, 2));
    } catch (error) {
      throw new Error(`Error saving users: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const users = await this.loadUsers();
    return users.find(user => user.email === email && user.isActive);
  }

  async findById(id: string): Promise<User | undefined> {
    const users = await this.loadUsers();
    return users.find(user => user.id === id && user.isActive);
  }

  async create(userData: {
    email: string;
    password: string;
    name: string;
    location: string;
    isVerified?: boolean;
  }): Promise<User> {
    const users = await this.loadUsers();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser: User = {
      id: `SELLER${String(users.length + 1).padStart(3, '0')}`,
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

    users.push(newUser);
    await this.saveUsers(users);
    
    return newUser;
  }

  // Método para obtener información del seller (sin password)
  async getSellerInfo(id: string) {
    const user = await this.findById(id);
    if (!user) return null;

    const { password, ...sellerInfo } = user;
    return sellerInfo;
  }

  // Método para actualizar información del usuario
  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const users = await this.loadUsers();
    const userIndex = users.findIndex(user => user.id === id && user.isActive);
    
    if (userIndex === -1) {
      return null;
    }

    // Si se está actualizando la contraseña, hashearla
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    users[userIndex] = updatedUser;
    await this.saveUsers(users);
    
    return updatedUser;
  }

  // Método para desactivar usuario (soft delete)
  async deactivate(id: string): Promise<boolean> {
    const users = await this.loadUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    users[userIndex].isActive = false;
    users[userIndex].updatedAt = new Date();
    await this.saveUsers(users);
    
    return true;
  }

  // Método para obtener todos los usuarios activos (sin passwords)
  async findAllActive(): Promise<Omit<User, 'password'>[]> {
    const users = await this.loadUsers();
    return users
      .filter(user => user.isActive)
      .map(({ password, ...user }) => user);
  }

  // Método para incrementar el contador de ventas
  async incrementSalesCount(id: string): Promise<boolean> {
    const users = await this.loadUsers();
    const userIndex = users.findIndex(user => user.id === id && user.isActive);
    
    if (userIndex === -1) {
      return false;
    }

    users[userIndex].salesCount += 1;
    users[userIndex].updatedAt = new Date();
    await this.saveUsers(users);
    
    return true;
  }

  // Método para actualizar la reputación
  async updateReputation(id: string, newReputation: number): Promise<boolean> {
    const users = await this.loadUsers();
    const userIndex = users.findIndex(user => user.id === id && user.isActive);
    
    if (userIndex === -1) {
      return false;
    }

    users[userIndex].reputation = Math.max(0, Math.min(5, newReputation)); // Clamp between 0-5
    users[userIndex].updatedAt = new Date();
    await this.saveUsers(users);
    
    return true;
  }
} 