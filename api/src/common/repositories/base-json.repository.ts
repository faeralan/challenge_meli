import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { IQueryableRepository } from './repository.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export abstract class BaseJsonRepository<T extends { id: string }> implements IQueryableRepository<T> {
  protected abstract readonly fileName: string;
  
  protected get filePath(): string {
    return path.join(process.cwd(), 'data', this.fileName);
  }

  protected async loadData(): Promise<T[]> {
    try {
      if (!fs.existsSync(this.filePath)) {
        await this.ensureDirectoryExists();
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        return [];
      }

      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new InternalServerErrorException(`Error loading data from ${this.fileName}: ${error.message}`);
    }
  }

  protected async saveData(items: T[]): Promise<void> {
    try {
      await this.ensureDirectoryExists();
      fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
    } catch (error) {
      throw new InternalServerErrorException(`Error saving data to ${this.fileName}: ${error.message}`);
    }
  }

  private async ensureDirectoryExists(): Promise<void> {
    const dataDir = path.dirname(this.filePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  async findAll(): Promise<T[]> {
    return await this.loadData();
  }

  async findById(id: string): Promise<T | null> {
    const items = await this.loadData();
    return items.find(item => item.id === id) || null;
  }

  async findBy(criteria: Partial<T>): Promise<T[]> {
    const items = await this.loadData();
    return items.filter(item => this.matchesCriteria(item, criteria));
  }

  async findOneBy(criteria: Partial<T>): Promise<T | null> {
    const items = await this.loadData();
    return items.find(item => this.matchesCriteria(item, criteria)) || null;
  }

  async create(entity: T): Promise<T> {
    const items = await this.loadData();
    
    // Check if entity with same ID already exists
    if (items.some(item => item.id === entity.id)) {
      throw new ConflictException(`Entity with ID ${entity.id} already exists`);
    }

    const newEntity = {
      ...entity,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    items.push(newEntity);
    await this.saveData(items);
    
    return newEntity;
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    const items = await this.loadData();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    const updatedEntity = {
      ...items[itemIndex],
      ...updates,
      updatedAt: new Date(),
    } as T;

    items[itemIndex] = updatedEntity;
    await this.saveData(items);
    
    return updatedEntity;
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.loadData();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return false;
    }

    items.splice(itemIndex, 1);
    await this.saveData(items);
    
    return true;
  }

  async exists(id: string): Promise<boolean> {
    const item = await this.findById(id);
    return item !== null;
  }

  protected matchesCriteria(item: T, criteria: Partial<T>): boolean {
    return Object.keys(criteria).every(key => {
      const criteriaValue = criteria[key as keyof T];
      const itemValue = item[key as keyof T];
      
      if (criteriaValue === undefined) return true;
      
      // Handle nested object comparison if needed
      if (typeof criteriaValue === 'object' && typeof itemValue === 'object') {
        return JSON.stringify(criteriaValue) === JSON.stringify(itemValue);
      }
      
      return itemValue === criteriaValue;
    });
  }
} 