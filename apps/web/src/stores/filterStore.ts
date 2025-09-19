import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  // Department and category filters
  selectedDepartment: string;
  selectedCategory: string;
  
  // Price range filters
  minPrice: string;
  maxPrice: string;
  
  // Rating filter
  minRating: string;
  
  // Search and sort
  searchQuery: string;
  sortBy: string;
  
  // Actions
  setDepartment: (department: string) => void;
  setCategory: (category: string) => void;
  setPriceRange: (min: string, max: string) => void;
  setMinRating: (rating: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  resetFilters: () => void;
}

const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      // Initial state
      selectedDepartment: '',
      selectedCategory: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      searchQuery: '',
      sortBy: 'name_asc',
      
      // Actions
      setDepartment: (department) => set({ selectedDepartment: department }),
      setCategory: (category) => set({ selectedCategory: category }),
      setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),
      setMinRating: (rating) => set({ minRating: rating }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sortBy) => set({ sortBy }),
      resetFilters: () => set({
        selectedDepartment: '',
        selectedCategory: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        searchQuery: '',
        sortBy: 'name_asc',
      }),
    }),
    {
      name: 'filter-storage',
    }
  )
);

export default useFilterStore;