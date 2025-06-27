export class Review {
  id: string;
  productId: string;
  rating: number; // 1-5
  comment: string;
  userName: string;
  date: Date;
  isVerified: boolean;
} 