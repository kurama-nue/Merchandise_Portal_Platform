import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ChevronRight,
  Shield,
  Edit,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface Address {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'office';
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'cod';
  label: string;
  icon: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<'address' | 'payment' | 'review'>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock cart items - replace with actual cart data
  const [cartItems] = useState<CheckoutItem[]>([
    {
      id: '1',
      name: 'Official Marvel Iron Man T-Shirt',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center',
      size: 'L',
      color: 'Red',
      quantity: 2
    },
    {
      id: '2',
      name: 'Anime Collection Hoodie',
      price: 1599,
      originalPrice: 2199,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&crop=center',
      size: 'M',
      color: 'Black',
      quantity: 1
    }
  ]);

  // Address form state
  const [address, setAddress] = useState<Address>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'home'
  });

  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  const paymentMethods: PaymentMethod[] = [
    { id: 'upi', type: 'upi', label: 'UPI (GooglePay, PhonePe, Paytm)', icon: '💳' },
    { id: 'card', type: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'netbanking', type: 'netbanking', label: 'Net Banking', icon: '🏦' },
    { id: 'cod', type: 'cod', label: 'Cash on Delivery', icon: '💵' }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 200; // Example discount
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleAddressSubmit = () => {
    if (!address.fullName || !address.email || !address.phone || !address.address || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setCurrentStep('review');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Order placed successfully!');
      navigate('/order-success');
    }, 2000);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[
          { id: 'address', label: 'Address', icon: MapPin },
          { id: 'payment', label: 'Payment', icon: CreditCard },
          { id: 'review', label: 'Review', icon: CheckCircle }
        ].map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = (step.id === 'address' && ['payment', 'review'].includes(currentStep)) ||
                            (step.id === 'payment' && currentStep === 'review');
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isCompleted ? 'bg-green-500 text-white' :
                isActive ? 'bg-purple-600 text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                <Icon size={20} />
              </div>
              <span className={`ml-2 font-medium ${
                isActive || isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < 2 && (
                <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Secure Checkout
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Address Step */}
            {currentStep === 'address' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Delivery Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={address.fullName}
                        onChange={(e) => setAddress({...address, fullName: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={address.email}
                        onChange={(e) => setAddress({...address, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({...address, pincode: e.target.value})}
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter pincode"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Complete Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 text-gray-400" size={20} />
                    <textarea
                      value={address.address}
                      onChange={(e) => setAddress({...address, address: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      placeholder="House No, Building, Street, Area"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      State *
                    </label>
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({...address, state: e.target.value})}
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Address Type
                  </label>
                  <div className="flex gap-4">
                    {[
                      { id: 'home', label: 'Home', icon: '🏠' },
                      { id: 'office', label: 'Office', icon: '🏢' }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setAddress({...address, addressType: type.id as 'home' | 'office'})}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-colors ${
                          address.addressType === type.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddressSubmit}
                  className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`w-full flex items-center justify-between p-6 border-2 rounded-xl transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="text-left">
                          <div className="font-bold text-gray-900 dark:text-white">
                            {method.label}
                          </div>
                          {method.id === 'cod' && (
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Extra ₹40 charges
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        selectedPaymentMethod === method.id
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === method.id && (
                          <CheckCircle className="w-full h-full text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div className="text-sm text-green-800 dark:text-green-300">
                    <div className="font-bold">100% Secure Payment</div>
                    <div>Your payment information is encrypted and secure</div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep('address')}
                    className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:border-purple-600 transition-colors"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Order Review
                  </h2>

                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Size: {item.size} | Color: {item.color}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-gray-900 dark:text-white">₹{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-300">× {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Address</h3>
                    <button
                      onClick={() => setCurrentStep('address')}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="font-bold text-gray-900 dark:text-white">{address.fullName}</div>
                    <div className="text-gray-700 dark:text-gray-300 mt-1">{address.address}</div>
                    <div className="text-gray-700 dark:text-gray-300">{address.city}, {address.state} - {address.pincode}</div>
                    <div className="text-gray-700 dark:text-gray-300 mt-2">Phone: {address.phone}</div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h3>
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <Edit size={16} />
                      Change
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {paymentMethods.find(p => p.id === selectedPaymentMethod)?.label}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Place Order - ₹{total}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {item.size} | {item.color} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
                
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                
                <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>100% Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Free shipping on orders above ₹999</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>30 days easy returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;