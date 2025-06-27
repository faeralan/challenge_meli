export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  maxInstallments?: number;
  description?: string;
} 