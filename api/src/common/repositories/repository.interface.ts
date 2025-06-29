export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}

export interface IQueryableRepository<T> extends IRepository<T> {
  findBy(criteria: Partial<T>): Promise<T[]>;
  findOneBy(criteria: Partial<T>): Promise<T | null>;
} 