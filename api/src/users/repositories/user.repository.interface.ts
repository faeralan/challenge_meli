import { IQueryableRepository } from '../../common/repositories/repository.interface';
import { User } from '../entities/user.entity';

export interface IUserRepository extends IQueryableRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findActiveUsers(): Promise<Omit<User, 'password'>[]>;
  incrementSalesCount(id: string): Promise<boolean>;
} 