import { create } from 'zustand';

interface Participant {
  id: string;
  userId: string;
  userName: string;
  status: string;
  joinedAt?: string;
}

interface GroupOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface GroupOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: GroupOrderItem[];
  participants: Participant[];
}

interface GroupOrderState {
  // Group orders
  groupOrders: GroupOrder[];
  currentGroupOrder: GroupOrder | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchGroupOrders: () => Promise<void>;
  fetchGroupOrderById: (id: string) => Promise<void>;
  createGroupOrder: (orderData: any) => Promise<string>;
  finalizeGroupOrder: (id: string) => Promise<void>;
  cancelGroupOrder: (id: string) => Promise<void>;
  inviteParticipant: (groupOrderId: string, email: string) => Promise<void>;
  setError: (error: string | null) => void;
  clearCurrentGroupOrder: () => void;
}

const useGroupOrderStore = create<GroupOrderState>((set, get) => ({
  // Initial state
  groupOrders: [],
  currentGroupOrder: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchGroupOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/orders/group');
      if (!response.ok) throw new Error('Failed to fetch group orders');
      
      const data = await response.json();
      set({ groupOrders: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
    }
  },
  
  fetchGroupOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/orders/group/${id}`);
      if (!response.ok) throw new Error('Failed to fetch group order details');
      
      const data = await response.json();
      set({ currentGroupOrder: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
    }
  },
  
  createGroupOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/orders/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) throw new Error('Failed to create group order');
      
      const data = await response.json();
      await get().fetchGroupOrders();
      return data.id;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
      throw error;
    }
  },
  
  finalizeGroupOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/orders/group/${id}/finalize`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to finalize group order');
      
      await get().fetchGroupOrders();
      if (get().currentGroupOrder?.id === id) {
        await get().fetchGroupOrderById(id);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
      throw error;
    }
  },
  
  cancelGroupOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/orders/group/${id}/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to cancel group order');
      
      await get().fetchGroupOrders();
      if (get().currentGroupOrder?.id === id) {
        await get().fetchGroupOrderById(id);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
      throw error;
    }
  },
  
  inviteParticipant: async (groupOrderId, email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/orders/group/${groupOrderId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) throw new Error('Failed to invite participant');
      
      if (get().currentGroupOrder?.id === groupOrderId) {
        await get().fetchGroupOrderById(groupOrderId);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
      throw error;
    }
  },
  
  setError: (error) => set({ error }),
  clearCurrentGroupOrder: () => set({ currentGroupOrder: null }),
}));

export default useGroupOrderStore;