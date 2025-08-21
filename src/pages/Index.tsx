import React, { useEffect, useRef, useState } from 'react';
import { Camera, Search } from 'lucide-react';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  // Custom useInView hook with enhanced options
  const useInView = () => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting);
        }, 
        { 
          threshold: 0.3,
          rootMargin: '-10% 0px -10% 0px'
        }
      );
      
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    
    return { ref, inView };
  };

  // Parallax scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hero = useInView();
  const secondSection = useInView();
  const thirdSection = useInView();

  const Button = ({ children, className, ...props }) => (
    <button 
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  const Section = ({ children, className, style, ...props }) => (
    <section 
      className={`relative ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </section>
  );

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white overflow-x-hidden"
      style={{
        // 스크롤 스냅 적용
        scrollSnapType: 'y mandatory',
        overflowY: 'scroll',
        height: '100vh'
      }}
    >
      {/* Hero Section - Fixed Background with Parallax */}
      <Section 
        className="min-h-screen flex items-center justify-center relative overflow-hidden gradient-hero"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          scrollSnapAlign: 'start'
        }}
      >
        {/* Floating Shapes */}
        <div className="flow-shape w-32 h-32 top-20 left-10 animate-float"></div>
        <div className="flow-shape-2 w-24 h-24 top-40 right-20 animate-flow"></div>
        <div className="flow-shape w-20 h-20 bottom-32 left-1/4"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div 
            ref={hero.ref}
            className={`max-w-2xl text-center space-y-8 transition-all duration-1000 ease-out ${
              hero.inView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <h1 className="text-5xl md:text-7xl text-white font-bold leading-tight animate-glow">
              Diagnose. Match. Heal.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              AI가 제안하는 당신만의 피부 솔루션
            </p>
            <div className="pt-4">
              <Button className="btn-glass text-white hover:bg-white hover:text-black text-lg px-8 py-4 animate-float">
                시작하기
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* AI 진단 Section with Hover Effects */}
      <Section 
        className="min-h-screen relative group cursor-pointer overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          scrollSnapAlign: 'start'
        }}
      >
        {/* Floating Shapes */}
        <div className="flow-shape w-28 h-28 top-16 right-10 opacity-30"></div>
        <div className="flow-shape-2 w-20 h-20 bottom-20 left-16 opacity-20"></div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        <div className="container mx-auto px-6 h-full flex items-center justify-center relative z-10">
          <div 
            ref={secondSection.ref}
            className={`text-center space-y-8 transition-all duration-1000 ease-out ${
              secondSection.inView 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-20 scale-95'
            }`}
          >
            {/* Glass Card Container */}
            <div className="glass-card p-8 rounded-3xl group-hover:scale-105 transition-all duration-300 animate-float">
              <Camera className="w-16 h-16 text-white mx-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-glow" />
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-6">
                AI 기술로 종양을 정밀 분석
              </h2>
              
              <p className="text-lg text-white/80 max-w-lg mx-auto mt-4">
                정밀한 촬영으로 신뢰할 수 있는 분석 결과를 제공합니다
              </p>
            </div>
            
            {/* 호버시 나타나는 버튼 */}
            <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
              <Button className="btn-k-beauty">
                AI 종양 분석하기
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* AI 안면 분석 Section */}
      <Section 
        className="min-h-screen relative group cursor-pointer overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          scrollSnapAlign: 'start'
        }}
      >
        {/* Floating Shapes */}
        <div className="flow-shape-2 w-32 h-32 top-20 left-16 opacity-25"></div>
        <div className="flow-shape w-24 h-24 bottom-24 right-20 opacity-30"></div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        <div className="container mx-auto px-6 h-full flex items-center justify-center relative z-10">
          <div 
            ref={thirdSection.ref}
            className={`text-center space-y-8 transition-all duration-1000 ease-out ${
              thirdSection.inView 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-20 scale-95'
            }`}
          >
            {/* Luxury Card Container */}
            <div className="luxury-card p-8 rounded-3xl group-hover:scale-105 transition-all duration-300 animate-float">
              <Search className="w-16 h-16 text-gray-700 mx-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-glow" />
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6">
                AI 기술로 얼굴을 자동 인식하고 분석
              </h2>
              
              <p className="text-lg text-gray-600 max-w-lg mx-auto mt-4">
                정확한 얼굴 인식 기술로 개인 맞춤형 분석을 제공합니다
              </p>
            </div>
            
            {/* 호버시 나타나는 버튼 */}
            <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
              <Button className="btn-luxury">
                AI 안면부 분석하기
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* 추가 섹션 - 특징 소개 */}
      <Section 
        className="min-h-screen gradient-cream-flow flex items-center justify-center relative overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
        {/* Background Floating Shapes */}
        <div className="flow-shape w-40 h-40 top-10 left-10 opacity-20"></div>
        <div className="flow-shape-2 w-32 h-32 top-32 right-16 opacity-15"></div>
        <div className="flow-shape w-24 h-24 bottom-20 left-1/3 opacity-25"></div>
        <div className="flow-shape-2 w-28 h-28 bottom-10 right-1/4 opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-16">
            <div className="space-y-4 animate-float">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-gradient-primary">
                왜 우리를 선택해야 할까요?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                최신 AI 기술과 전문의 네트워크로 최고의 진료 경험을 제공합니다
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="glass-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-float group">
                <Camera className="w-12 h-12 text-pink-600 mx-auto animate-glow group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-gray-800 mt-4">정밀 분석</h3>
                <p className="text-gray-600 mt-2">간결한 촬영으로 신뢰할 수 있는 결과를 제공합니다</p>
              </div>
              
              <div className="luxury-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-flow group">
                <Search className="w-12 h-12 text-pink-700 mx-auto animate-glow group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-gray-800 mt-4">전문의 매칭</h3>
                <p className="text-gray-600 mt-2">필요할 때 정확한 전문의와 연결해드립니다</p>
              </div>
            </div>
            
            <div className="pt-8">
              <Button className="btn-k-beauty text-lg px-10 py-4 animate-glow">
                지금 시작하기
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Index;