import { IRepository } from '../../common/repositories/repository.interface';
import { User } from '../entities/user.entity';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  incrementSalesCount(id: string): Promise<boolean>;
} 