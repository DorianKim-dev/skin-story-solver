import React, { useEffect, useRef, useState } from 'react';
import { Camera, Search, ArrowRight, ShieldCheck, Timer, Sparkles, MousePointerClick } from 'lucide-react';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  
  // 간단한 상태 관리
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    second: false,
    third: false
  });
  
  // refs
  const heroRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);

  // 🔥 완전히 새로운 접근: 스크롤 기반 가시성 체크
  useEffect(() => {
    const checkVisibility = () => {
      const sections = [
        { ref: heroRef, key: 'hero', name: 'Hero' },
        { ref: secondRef, key: 'second', name: 'Second' },
        { ref: thirdRef, key: 'third', name: 'Third' }
      ];

      const newVisibility = {};
      
      sections.forEach(({ ref, key, name }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // 더 관대한 조건: 요소의 30% 이상이 보이면 visible
          const visibleHeight = Math.max(0, 
            Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
          );
          const totalHeight = rect.height;
          const visibilityPercentage = (visibleHeight / totalHeight) * 100;
          
          const isVisible = visibilityPercentage > 30;
          newVisibility[key] = isVisible;
          
          console.log(`📊 ${name} Visibility:`, {
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            height: Math.round(totalHeight),
            visibleHeight: Math.round(visibleHeight),
            percentage: Math.round(visibilityPercentage),
            isVisible,
            windowHeight
          });
        } else {
          newVisibility[key] = false;
        }
      });

      // 상태 업데이트 (변경된 것만)
      setVisibleSections(prev => {
        let hasChanged = false;
        const updated = { ...prev };
        
        Object.keys(newVisibility).forEach(key => {
          if (prev[key] !== newVisibility[key]) {
            hasChanged = true;
            updated[key] = newVisibility[key];
            console.log(`🔄 ${key} visibility changed: ${prev[key]} → ${newVisibility[key]}`);
          }
        });
        
        return hasChanged ? updated : prev;
      });
    };

    // 스크롤 이벤트에 체크 함수 연결
    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);
      
      // 스크롤할 때마다 가시성 체크
      checkVisibility();
    };

    // 초기 체크
    setTimeout(checkVisibility, 100);
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 리사이즈 시에도 체크
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);

  // 수동 체크 함수 (디버깅용)
  const manualCheck = () => {
    console.log('🔍 Manual check triggered');
    const sections = [
      { ref: heroRef, name: 'Hero', visible: visibleSections.hero },
      { ref: secondRef, name: 'Second', visible: visibleSections.second },
      { ref: thirdRef, name: 'Third', visible: visibleSections.third }
    ];

    sections.forEach(({ ref, name, visible }) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        console.log(`🔍 ${name}:`, {
          currentState: visible,
          rect: {
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            height: Math.round(rect.height)
          },
          windowHeight: window.innerHeight
        });
      }
    });
  };

  // 디버깅 로그
  console.log('🟡 Hero visible:', visibleSections.hero);
  console.log('🟢 Second visible:', visibleSections.second);
  console.log('🔵 Third visible:', visibleSections.third);

  // Components
  const Button = ({ children, className, ...props }) => (
    <button className={className} {...props}>
      {children}
    </button>
  );

  const Section = ({ children, className, style, ...props }) => (
    <section className={className} style={style} {...props}>
      {children}
    </section>
  );

  const Container = ({ children }) => (
    <div className="mx-auto px-6 max-w-7xl">
      {children}
    </div>
  );

  const Typography = ({ children, className }) => (
    <h2 className={className}>{children}</h2>
  );

  const Link = ({ children, to, ...props }) => (
    <a href={to} {...props}>{children}</a>
  );

  return (
    <div className="theme-home-bright min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <Section 
        className="relative min-h-screen parallax-section"
        style={{
          backgroundImage: 'url(/lovable-uploads/d89990f8-9655-40af-a548-ce462b0ff981.png)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <Container>
          <div className="relative z-10 flex items-center justify-center py-20 min-h-screen">
            <div 
              ref={heroRef}
              className={`w-full max-w-2xl text-center space-y-6 mt-20 transition-all duration-1000 ease-out ${
                visibleSections.hero 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transform: `translateY(${scrollY * 0.5}px)`,
              }}
              onClick={() => {
                console.log('🟡 Hero clicked, visible:', visibleSections.hero);
                manualCheck();
              }}
            >
              <div className="text-4xl md:text-6xl text-white font-sans font-bold text-center">
                Diagnose. Match. Heal.
              </div>
              <Typography className="max-w-xl mx-auto text-white/90 text-center">
                AI가 제안하는 당신만의 피부 솔루션
              </Typography>
            </div>
          </div>
        </Container>
      </Section>

      {/* Second Section */}
      <Section 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/e737c29e-2c53-4377-945c-75e21ea3a41d.png)'
        }}
      >
        <Container>
          <div 
            ref={secondRef}
            className={`flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
              visibleSections.second 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            onClick={() => {
              console.log('🟢 Second clicked, visible:', visibleSections.second);
              manualCheck();
            }}
          >
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
              AI 기술로 종양을 정밀 분석
            </h2>
            <Link to="/camera">
              <Button 
                className="bg-transparent border-2 border-white text-white font-sans hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg"
              >
                AI 종양 분석하기
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Third Section */}
      <Section 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/3cf38996-cc98-4c21-b772-a8382b1405c8.png)'
        }}
      >
        <Container>
          <div 
            ref={thirdRef}
            className={`flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
              visibleSections.third 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            onClick={() => {
              console.log('🔵 Third clicked, visible:', visibleSections.third);
              manualCheck();
            }}
            onMouseEnter={() => console.log('🔵 Mouse entered third section')}
          >
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
              AI 기술로 얼굴을 자동 인식하고 분석
            </h2>
            <Link to="/camera">
              <Button 
                className="bg-transparent border-2 border-white text-white font-sans hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg"
              >
                AI 안면부 분석하기
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* 간소화된 디버깅 패널 */}
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 9999,
          fontFamily: 'monospace',
          minWidth: '300px'
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>📊 Scroll-Based Detection</div>
        <div>🟡 Hero: {visibleSections.hero ? '✅ VISIBLE' : '❌ HIDDEN'}</div>
        <div>🟢 Second: {visibleSections.second ? '✅ VISIBLE' : '❌ HIDDEN'}</div>
        <div>🔵 Third: {visibleSections.third ? '✅ VISIBLE' : '❌ HIDDEN'}</div>
        <div>📏 Scroll: {Math.round(scrollY)}px</div>
        <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
          <div>Hero Ref: {heroRef.current ? '✅' : '❌'}</div>
          <div>Second Ref: {secondRef.current ? '✅' : '❌'}</div>
          <div>Third Ref: {thirdRef.current ? '✅' : '❌'}</div>
        </div>
        <button 
          onClick={manualCheck}
          style={{
            marginTop: '10px',
            padding: '5px 10px',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Manual Check
        </button>
        <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.7 }}>
          ✨ New: Pure scroll-based detection, no IntersectionObserver conflicts
        </div>
      </div>
    </div>
  );
};

export default Index;