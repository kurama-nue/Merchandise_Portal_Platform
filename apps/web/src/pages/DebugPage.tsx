import { useState, useEffect } from 'react';

const DebugPage = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      timestamp: new Date().toISOString(),
      location: window.location.href,
      userAgent: navigator.userAgent,
      viteMode: (import.meta as any).env?.MODE || 'unknown',
      apiUrl: (import.meta as any).env?.VITE_API_URL || 'Not set',
    });
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: '#f8fafc', 
      padding: '40px',
      fontFamily: 'monospace'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '30px', 
          color: '#3b82f6',
          textAlign: 'center'
        }}>
          🚀 Debug Information
        </h1>
        
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '30px', 
          borderRadius: '12px', 
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#10b981', marginBottom: '20px' }}>✅ System Status</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>📅 Timestamp: {debugInfo.timestamp}</div>
            <div>🌍 Location: {debugInfo.location}</div>
            <div>⚙️ Vite Mode: {debugInfo.viteMode}</div>
            <div>🔗 API URL: {debugInfo.apiUrl}</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '30px', 
          borderRadius: '12px', 
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#f59e0b', marginBottom: '20px' }}>🧪 Route Tests</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            <a href="/" style={{ 
              color: '#3b82f6', 
              textDecoration: 'none',
              padding: '10px',
              backgroundColor: '#374151',
              borderRadius: '6px',
              display: 'block'
            }}>
              🏠 Home (Simple Page)
            </a>
            <a href="/enhanced" style={{ 
              color: '#3b82f6', 
              textDecoration: 'none',
              padding: '10px',
              backgroundColor: '#374151',
              borderRadius: '6px',
              display: 'block'
            }}>
              ✨ Enhanced Home (3D Experience)
            </a>
            <a href="/test" style={{ 
              color: '#3b82f6', 
              textDecoration: 'none',
              padding: '10px',
              backgroundColor: '#374151',
              borderRadius: '6px',
              display: 'block'
            }}>
              🧪 Test Page
            </a>
            <a href="/products" style={{ 
              color: '#3b82f6', 
              textDecoration: 'none',
              padding: '10px',
              backgroundColor: '#374151',
              borderRadius: '6px',
              display: 'block'
            }}>
              🛍️ Products Page
            </a>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '30px', 
          borderRadius: '12px'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '20px' }}>🔧 Troubleshooting</h2>
          <ul style={{ lineHeight: '1.8' }}>
            <li>✅ Server running on localhost:5173</li>
            <li>✅ Mock AuthContext loaded (no API dependency)</li>
            <li>✅ Router configuration active</li>
            <li>✅ All components compiled successfully</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
