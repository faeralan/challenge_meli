export class User {
  id: string;
  email: string;
  password: string;
  name: string;
  reputation: number; // 0-5
  location: string;
  salesCount: number;
  joinDate: Date;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 