import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

const Index = () => {
  const {
    isAuthenticated,
    logout
  } = useAuthContext();

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat font-sans" style={{
      backgroundImage: 'url(/lovable-uploads/bca51040-9104-48a6-a90b-dd809d1efc5f.png)'
    }}>
      {/* Minimal top nav with equal spacing */}
      <div className="grid grid-cols-4 items-center py-4 px-4 text-sm text-white/80">
        <Link to="/camera" className="text-center hover:text-white">Camera</Link>
        <Link to="/analysis" className="text-center hover:text-white">Results</Link>
        <Link to="/profile" className="text-center hover:text-white">My Page</Link>
        {isAuthenticated ? <button onClick={logout} className="text-center hover:text-white">Logout</button> : <Link to="/login" className="text-center hover:text-white">Login</Link>}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <h1 className="text-4xl md:text-5xl text-white font-sans font-bold text-center mb-8 max-w-4xl">
          AI로 피부 질환 진단을 빠르고 쉽게 받아보세요
        </h1>
        
        <Link to="/camera">
          <button className="px-8 py-4 text-white border-2 border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-lg text-lg font-medium font-sans">
            AI분석하기
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Index;