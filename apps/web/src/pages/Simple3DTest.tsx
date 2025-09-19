import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Simple 3D Box component
function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

// Simple 3D Test Page
const Simple3DTest = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">3D Engine Test</h1>
        <p className="text-center mb-8">Testing React Three Fiber compatibility</p>
        
        {/* 3D Canvas */}
        <div className="w-full h-96 bg-gray-800 rounded-lg overflow-hidden">
          <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400">Loading 3D...</div>}>
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Box />
              <OrbitControls />
            </Canvas>
          </Suspense>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-green-400">✅ If you can see a rotating orange cube above, 3D is working!</p>
          <div className="mt-4 space-x-4">
            <a href="/" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Back to Home
            </a>
            <a href="/enhanced" className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition-colors">
              Try Enhanced 3D
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simple3DTest;
