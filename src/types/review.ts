export interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment?: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment?: string;
}
