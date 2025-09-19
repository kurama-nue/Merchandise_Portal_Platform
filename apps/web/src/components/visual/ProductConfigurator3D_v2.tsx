import { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  Text,
  Float
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Download, Share2, Eye } from 'lucide-react';
import * as THREE from 'three';

// Product Model Component
const ProductModel = ({ 
  productType = 'tshirt',
  selectedColor = '#3b82f6',
  selectedMaterial = 'cotton',
  customText = '',
  textPosition = [0, 0, 0.1] as [number, number, number],
  scale = 1
}: {
  productType?: string;
  selectedColor?: string;
  selectedMaterial?: string;
  customText?: string;
  textPosition?: [number, number, number];
  scale?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Material properties based on selection
  const materialProps = useMemo(() => {
    switch (selectedMaterial) {
      case 'cotton':
        return { roughness: 0.8, metalness: 0.1 };
      case 'polyester':
        return { roughness: 0.6, metalness: 0.2 };
      case 'silk':
        return { roughness: 0.2, metalness: 0.8 };
      case 'leather':
        return { roughness: 0.9, metalness: 0.0 };
      default:
        return { roughness: 0.7, metalness: 0.1 };
    }
  }, [selectedMaterial]);

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={scale}>
        {/* T-Shirt Model */}
        {productType === 'tshirt' && (
          <mesh ref={meshRef} position={[0, 0, 0]}>
            <boxGeometry args={[2, 2.5, 0.2]} />
            <meshStandardMaterial 
              color={selectedColor}
              {...materialProps}
            />
          </mesh>
        )}
        
        {/* Hoodie Model */}
        {productType === 'hoodie' && (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.2, 2.8, 0.3]} />
              <meshStandardMaterial 
                color={selectedColor}
                {...materialProps}
              />
            </mesh>
            {/* Hood */}
            <mesh position={[0, 1.2, -0.2]}>
              <sphereGeometry args={[0.8, 16, 8, 0, Math.PI]} />
              <meshStandardMaterial 
                color={selectedColor}
                {...materialProps}
              />
            </mesh>
          </group>
        )}
        
        {/* Mug Model */}
        {productType === 'mug' && (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.8, 0.9, 1.5, 32]} />
              <meshStandardMaterial 
                color={selectedColor}
                {...materialProps}
              />
            </mesh>
            {/* Handle */}
            <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.3, 0.1, 8, 16]} />
              <meshStandardMaterial 
                color={selectedColor}
                {...materialProps}
              />
            </mesh>
          </group>
        )}
        
        {/* Backpack Model */}
        {productType === 'backpack' && (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.5, 2, 0.8]} />
              <meshStandardMaterial 
                color={selectedColor}
                {...materialProps}
              />
            </mesh>
            {/* Straps */}
            <mesh position={[-0.5, 0.8, -0.5]}>
              <cylinderGeometry args={[0.05, 0.05, 1.5]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            <mesh position={[0.5, 0.8, -0.5]}>
              <cylinderGeometry args={[0.05, 0.05, 1.5]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          </group>
        )}

        {/* Custom Text Overlay */}
        {customText && (
          <Text
            position={textPosition}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {customText}
          </Text>
        )}
      </group>
    </Float>
  );
};

// Color Picker Component
const ColorPicker = ({ 
  selectedColor, 
  onColorChange 
}: { 
  selectedColor: string; 
  onColorChange: (color: string) => void; 
}) => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#6b7280', '#000000',
    '#ffffff', '#fbbf24', '#06b6d4', '#84cc16'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-3">Colors</h3>
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => (
          <motion.button
            key={color}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color ? 'border-white' : 'border-gray-400'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

// Material Selector Component
const MaterialSelector = ({ 
  selectedMaterial, 
  onMaterialChange 
}: { 
  selectedMaterial: string; 
  onMaterialChange: (material: string) => void; 
}) => {
  const materials = [
    { id: 'cotton', name: 'Cotton', icon: '🌿' },
    { id: 'polyester', name: 'Polyester', icon: '🧵' },
    { id: 'silk', name: 'Silk', icon: '✨' },
    { id: 'leather', name: 'Leather', icon: '🐄' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-3">Materials</h3>
      <div className="space-y-2">
        {materials.map((material) => (
          <motion.button
            key={material.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMaterialChange(material.id)}
            className={`w-full p-3 rounded-lg border transition-all text-left flex items-center gap-3 ${
              selectedMaterial === material.id
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
            }`}
          >
            <span className="text-xl">{material.icon}</span>
            <span className="font-medium">{material.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Product Type Selector
const ProductTypeSelector = ({ 
  selectedType, 
  onTypeChange 
}: { 
  selectedType: string; 
  onTypeChange: (type: string) => void; 
}) => {
  const products = [
    { id: 'tshirt', name: 'T-Shirt', icon: '👕' },
    { id: 'hoodie', name: 'Hoodie', icon: '🧥' },
    { id: 'mug', name: 'Mug', icon: '☕' },
    { id: 'backpack', name: 'Backpack', icon: '🎒' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-3">Product Type</h3>
      <div className="grid grid-cols-2 gap-2">
        {products.map((product) => (
          <motion.button
            key={product.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTypeChange(product.id)}
            className={`p-3 rounded-lg border transition-all text-center ${
              selectedType === product.id
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
            }`}
          >
            <div className="text-2xl mb-1">{product.icon}</div>
            <div className="text-sm font-medium">{product.name}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Custom Text Input
const CustomTextInput = ({ 
  customText, 
  onTextChange 
}: { 
  customText: string; 
  onTextChange: (text: string) => void; 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-3">Custom Text</h3>
      <input
        type="text"
        value={customText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter custom text..."
        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
        maxLength={20}
      />
      <p className="text-gray-400 text-sm mt-2">{customText.length}/20 characters</p>
    </div>
  );
};

// AR Preview Modal
const ARPreviewModal = ({ 
  isOpen, 
  onClose, 
  productConfig 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  productConfig: any; 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">AR Preview</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="bg-gray-800 rounded-xl h-64 flex items-center justify-center mb-6">
              <div className="text-center text-white">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">AR Preview</p>
                <p className="text-gray-400">Camera view would appear here</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-white"><strong>Product:</strong> {productConfig.type}</p>
              <p className="text-white"><strong>Color:</strong> {productConfig.color}</p>
              <p className="text-white"><strong>Material:</strong> {productConfig.material}</p>
              {productConfig.customText && (
                <p className="text-white"><strong>Text:</strong> "{productConfig.customText}"</p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              Launch AR Camera
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main ProductConfigurator3D Component
const ProductConfigurator3D = ({ 
  isOpen, 
  onClose, 
  initialProduct 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialProduct?: any; 
}) => {
  const [productType, setProductType] = useState(initialProduct?.type || 'tshirt');
  const [selectedColor, setSelectedColor] = useState(initialProduct?.color || '#3b82f6');
  const [selectedMaterial, setSelectedMaterial] = useState(initialProduct?.material || 'cotton');
  const [customText, setCustomText] = useState(initialProduct?.customText || '');
  const [isARModalOpen, setIsARModalOpen] = useState(false);

  const productConfig = {
    type: productType,
    color: selectedColor,
    material: selectedMaterial,
    customText
  };

  const resetConfiguration = () => {
    setProductType('tshirt');
    setSelectedColor('#3b82f6');
    setSelectedMaterial('cotton');
    setCustomText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex"
        >
          {/* 3D Viewport */}
          <div className="flex-1 relative">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <Environment preset="studio" />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} />
                
                <ProductModel
                  productType={productType}
                  selectedColor={selectedColor}
                  selectedMaterial={selectedMaterial}
                  customText={customText}
                  scale={1.5}
                />
                
                <ContactShadows 
                  position={[0, -2, 0]} 
                  opacity={0.4} 
                  scale={10} 
                  blur={2} 
                  far={4} 
                />
                
                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  enableRotate={true}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI - Math.PI / 6}
                />
              </Suspense>
            </Canvas>
            
            {/* 3D Controls Overlay */}
            <div className="absolute top-4 left-4 text-white/60 text-sm">
              <p>🖱️ Drag to rotate • Scroll to zoom</p>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="w-96 bg-gray-900/95 backdrop-blur-lg p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">3D Configurator</h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Configuration Options */}
            <div className="space-y-6">
              <ProductTypeSelector 
                selectedType={productType}
                onTypeChange={setProductType}
              />
              
              <ColorPicker 
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
              
              <MaterialSelector 
                selectedMaterial={selectedMaterial}
                onMaterialChange={setSelectedMaterial}
              />
              
              <CustomTextInput 
                customText={customText}
                onTextChange={setCustomText}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsARModalOpen(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              >
                <Eye className="w-5 h-5" />
                AR Preview
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetConfiguration}
                className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/10 border border-white/20 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Save
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/10 border border-white/20 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
              >
                Add to Cart - $29.99
              </motion.button>
            </div>
          </div>

          {/* AR Preview Modal */}
          <ARPreviewModal 
            isOpen={isARModalOpen}
            onClose={() => setIsARModalOpen(false)}
            productConfig={productConfig}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductConfigurator3D;
