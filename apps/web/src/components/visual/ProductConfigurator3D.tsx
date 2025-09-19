import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Html, useGLTF } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { RotateCcw, Palette, Layers, Zap, Camera, Download, Share2, Heart } from 'lucide-react';

// 3D Product Model Component
function ProductModel({ 
  productType, 
  customText, 
  isRotating,
  onInteraction 
}: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Map productType to model file
  const modelMap: Record<string, string> = {
    tshirt: '/models/tshirt.glb',
    hoodie: '/models/hoodie.glb',
    mug: '/models/mug.glb',
    backpack: '/models/backpack.glb',
  };
  const modelPath = modelMap[productType] || modelMap['tshirt'];
  const { scene } = useGLTF(modelPath, true);

  useFrame((state) => {
    if (groupRef.current) {
      if (isRotating) {
        groupRef.current.rotation.y += 0.01;
      }
      // Subtle breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      groupRef.current.scale.setScalar(hovered ? scale * 1.1 : scale);
    }
  });

  // Optionally update material color here if needed
  // (advanced: traverse scene and set color)

  return (
    <group ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onInteraction}
      castShadow
      receiveShadow
    >
      <primitive object={scene} />

      {/* Custom Text Overlay */}
      {customText && (
        <Text
          position={[0, 0, 0.15]}
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

      {/* Interactive Hotspots */}
      {hovered && (
        <>
          <Html position={[1.2, 1, 0]} distanceFactor={8}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <p className="text-xs text-gray-700">Click to customize</p>
            </div>
          </Html>
          <mesh position={[1, 1, 0]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="#3b82f6" />
          </mesh>
        </>
      )}
    </group>
  );
}

// AR Preview Component
function ARPreview({ isVisible, onClose }: any) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">AR Preview</h3>
              <p className="text-gray-600 mb-6">
                Point your camera at a flat surface to see how this product looks in your space.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold">
                  Open Camera
                </button>
                <button 
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Material Selector Component
function MaterialSelector({ selectedMaterial, onMaterialChange, materials }: any) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Layers className="w-4 h-4" />
        Material
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {materials.map((material: any) => (
          <motion.button
            key={material.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMaterialChange(material.id)}
            className={`p-3 rounded-xl border-2 transition-all ${
              selectedMaterial === material.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div 
              className="w-full h-8 rounded-lg mb-2"
              style={{ 
                background: material.preview,
                backgroundSize: 'cover'
              }}
            />
            <p className="text-xs font-medium text-gray-700">{material.name}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Color Picker Component
function ColorPicker({ selectedColor, onColorChange, colors }: any) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        Color
      </h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color: string) => (
          <motion.button
            key={color}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color
                ? 'border-gray-900 scale-110'
                : 'border-gray-300 hover:border-gray-500'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
        
        {/* Custom Color Input */}
        <div className="relative">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer opacity-0 absolute inset-0"
          />
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gradient-to-br from-red-400 via-yellow-400 to-purple-400">
            <span className="text-xs text-white font-bold">+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Product Configurator Component
export const ProductConfigurator3D = ({ 
  product, 
  isOpen, 
  onClose, 
  onSave 
}: {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}) => {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedMaterial, setSelectedMaterial] = useState('cotton');
  const [customText, setCustomText] = useState('');
  const [isRotating, setIsRotating] = useState(true);
  const [showAR, setShowAR] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // '3d', 'wireframe', 'xray'
  
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
    '#ec4899', '#6366f1', '#14b8a6', '#eab308'
  ];
  
  const materials = [
    { id: 'cotton', name: 'Cotton', preview: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)' },
    { id: 'denim', name: 'Denim', preview: 'linear-gradient(45deg, #1e3a8a, #3730a3)' },
    { id: 'leather', name: 'Leather', preview: 'linear-gradient(45deg, #92400e, #b45309)' },
    { id: 'metal', name: 'Metal', preview: 'linear-gradient(45deg, #6b7280, #9ca3af)' },
    { id: 'plastic', name: 'Plastic', preview: 'linear-gradient(45deg, #1f2937, #374151)' },
  ];

  const handleSave = () => {
    const config = {
      productId: product.id,
      color: selectedColor,
      material: selectedMaterial,
      customText,
      timestamp: new Date().toISOString()
    };
    onSave(config);
  };

  const handleShare = () => {
    navigator.share?.({
      title: `Custom ${product.name}`,
      text: `Check out my custom ${product.name} design!`,
      url: window.location.href
    });
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a high-res render
    console.log('Downloading configuration...');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden grid lg:grid-cols-2"
          >
            {/* 3D Viewer */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 min-h-[400px] lg:min-h-full">
              <Canvas
                shadows
                camera={{ position: [3, 2, 5], fov: 45 }}
                className="w-full h-full"
              >
                <Suspense fallback={null}>
                  <Environment preset="studio" />
                  <ambientLight intensity={0.4} />
                  <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={1} 
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                  />
                  
                  <ProductModel
                    productType={product.type || 'tshirt'}
                    selectedColor={selectedColor}
                    selectedMaterial={selectedMaterial}
                    customText={customText}
                    isRotating={isRotating}
                    onInteraction={() => setIsRotating(!isRotating)}
                  />
                  
                  <ContactShadows
                    rotation-x={Math.PI / 2}
                    position={[0, -2, 0]}
                    opacity={0.4}
                    width={10}
                    height={10}
                    blur={2}
                    far={3}
                  />
                  
                  <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={0}
                    autoRotate={isRotating}
                    autoRotateSpeed={2}
                  />
                </Suspense>
              </Canvas>
              
              {/* 3D Controls Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsRotating(!isRotating)}
                  className={`p-3 rounded-xl backdrop-blur-sm border border-white/20 ${
                    isRotating ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-700'
                  }`}
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAR(true)}
                  className="p-3 rounded-xl bg-white/80 backdrop-blur-sm text-gray-700 border border-white/20"
                >
                  <Camera className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* View Mode Toggle */}
              <div className="absolute top-4 right-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 flex gap-1">
                  {['3d', 'wireframe', 'xray'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all ${
                        viewMode === mode
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Performance Indicator */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-black/20 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Real-time Rendering
                  </div>
                </div>
              </div>
            </div>
            
            {/* Configuration Panel */}
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <p className="text-gray-600">Customize your product</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Color Picker */}
                <ColorPicker
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  colors={colors}
                />
                
                {/* Material Selector */}
                <MaterialSelector
                  selectedMaterial={selectedMaterial}
                  onMaterialChange={setSelectedMaterial}
                  materials={materials}
                />
                
                {/* Custom Text */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Custom Text
                  </h3>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Add your custom text..."
                    maxLength={20}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">{customText.length}/20 characters</p>
                </div>
                
                {/* Size Guide */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Size Guide</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        className="py-2 text-sm font-medium border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">${product.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Customization:</span>
                    <span className="font-semibold">+$5.00</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">${(product.price + 5).toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Add to Cart
                  </motion.button>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                    >
                      <Download className="w-4 h-4" />
                      Save
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                    >
                      <Heart className="w-4 h-4" />
                      Save
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* AR Preview Modal */}
          <ARPreview isVisible={showAR} onClose={() => setShowAR(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductConfigurator3D;
