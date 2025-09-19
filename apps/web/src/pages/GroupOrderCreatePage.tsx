import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Department {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

interface OrderItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

const GroupOrderCreatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialProduct = location.state?.initialProduct;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [items, setItems] = useState<OrderItem[]>(initialProduct ? [{
    productId: initialProduct.id,
    quantity: initialProduct.quantity || 1,
    name: initialProduct.name,
    price: initialProduct.price
  }] : []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchDepartments();
  }, []);
  
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
      
      // Set default department if user has one
      if (user?.departmentId) {
        setDepartmentId(user.departmentId);
      } else if (response.data.length > 0) {
        setDepartmentId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to load departments. Please try again.');
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await api.get('/products', {
        params: { search: searchQuery, limit: 5 }
      });
      setSearchResults(response.data.products);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const addProductToOrder = (product: Product) => {
    // Check if product is already in the order
    const existingItem = items.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity if product already exists
      setItems(items.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new product to order
      setItems([
        ...items,
        {
          productId: product.id,
          quantity: 1,
          name: product.name,
          price: product.price
        }
      ]);
    }
    
    // Clear search results
    setSearchResults([]);
    setSearchQuery('');
  };
  
  const removeItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };
  
  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(items.map(item => 
      item.productId === productId 
        ? { ...item, quantity }
        : item
    ));
  };
  
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Group order name is required');
      return;
    }
    
    if (!deadline) {
      setError('Deadline is required');
      return;
    }
    
    if (!departmentId) {
      setError('Department is required');
      return;
    }
    
    if (items.length === 0) {
      setError('At least one product is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        name,
        description,
        deadline,
        departmentId,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };
      
      await api.post('/orders/group', orderData);
      navigate('/group-orders', { state: { success: 'Group order created successfully!' } });
    } catch (error) {
      console.error('Error creating group order:', error);
      setError('Failed to create group order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Group Order</h1>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Order Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline *
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Products
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 p-2 border border-gray-300 rounded-l"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r"
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded overflow-hidden">
                  {searchResults.map(product => (
                    <div 
                      key={product.id} 
                      className="p-2 hover:bg-gray-50 flex items-center justify-between border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-2 bg-gray-100 rounded overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">₹{product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addProductToOrder(product)}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Selected Products */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Products</h3>
              {items.length === 0 ? (
                <div className="text-sm text-gray-500 p-4 border border-dashed border-gray-300 rounded text-center">
                  No products added yet
                </div>
              ) : (
                <div className="border border-gray-200 rounded overflow-hidden">
                  {items.map(item => (
                    <div key={item.productId} className="p-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 flex items-center">
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-1 border border-gray-300 rounded-l"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="w-16 text-center border-t border-b border-gray-300 py-1"
                        />
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1 border border-gray-300 rounded-r"
                        >
                          +
                        </button>
                        <div className="ml-auto font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-gray-50 flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/group-orders')}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading || items.length === 0}
          >
            {loading ? 'Creating...' : 'Create Group Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupOrderCreatePage;