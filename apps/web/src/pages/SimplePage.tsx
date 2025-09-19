const SimplePage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        🎉 Routes Are Working! 🎉
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        Server is running and responding correctly.
      </p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <a href="/test" style={{ 
          backgroundColor: '#3b82f6', 
          padding: '10px 20px', 
          borderRadius: '8px', 
          textDecoration: 'none', 
          color: 'white' 
        }}>
          Test Page
        </a>
        <a href="/products" style={{ 
          backgroundColor: '#10b981', 
          padding: '10px 20px', 
          borderRadius: '8px', 
          textDecoration: 'none', 
          color: 'white' 
        }}>
          Products
        </a>
      </div>
    </div>
  );
};

export default SimplePage;
