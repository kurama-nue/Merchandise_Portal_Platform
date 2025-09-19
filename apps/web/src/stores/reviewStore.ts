import { create } from 'zustand';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewState {
  // Reviews
  reviews: Review[];
  activeTab: 'open' | 'closed' | 'all';
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchReviews: () => Promise<void>;
  setActiveTab: (tab: 'open' | 'closed' | 'all') => void;
  updateReviewStatus: (reviewId: string, status: string) => Promise<void>;
  createReview: (reviewData: Omit<Review, 'id' | 'userId' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  setError: (error: string | null) => void;
}

const useReviewStore = create<ReviewState>((set, get) => ({
  // Initial state
  reviews: [],
  activeTab: 'open',
  isLoading: false,
  error: null,
  
  // Actions
  fetchReviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, string> = {};
      
      if (get().activeTab !== 'all') {
        params.status = get().activeTab === 'open' ? 'OPEN' : 'CLOSED,REJECTED';
      }
      
      const response = await fetch(`/api/reviews?${new URLSearchParams(params)}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      set({ reviews: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
    }
  },
  
  setActiveTab: (tab) => {
    set({ activeTab: tab });
    get().fetchReviews();
  },
  
  updateReviewStatus: async (reviewId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error('Failed to update review status');
      
      await get().fetchReviews();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
      throw error;
    }
  },
  
  createReview: async (reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      
      if (!response.ok) throw new Error('Failed to create review');
      
      await get().fetchReviews();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
      throw error;
    }
  },
  
  setError: (error) => set({ error }),
}));

export default useReviewStore;