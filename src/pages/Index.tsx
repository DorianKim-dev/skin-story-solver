import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Search, ArrowRight, ShieldCheck, Timer, Sparkles, MousePointerClick } from 'lucide-react';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  
  // 개별 섹션 상태
  const [heroInView, setHeroInView] = useState(false);
  const [secondInView, setSecondInView] = useState(false);
  const [thirdInView, setThirdInView] = useState(false);
  
  // refs
  const heroRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);

  // 🔧 수정된 intersection observer 설정
  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0],
      rootMargin: '100px 0px 100px 0px' // 더 관대한 마진
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const ratio = entry.intersectionRatio;
        const isIntersecting = entry.isIntersecting;
        
        console.log('👁️ Observer triggered:', {
          target: entry.target.dataset.section,
          isIntersecting,
          ratio: ratio.toFixed(2),
          rect: {
            top: Math.round(entry.boundingClientRect.top),
            bottom: Math.round(entry.boundingClientRect.bottom),
            height: Math.round(entry.boundingClientRect.height)
          }
        });

        // 더 관대한 조건: 10% 이상 보이거나 교차하고 있으면 true
        const shouldBeVisible = isIntersecting && ratio > 0.1;
        
        // 각 섹션별로 상태 업데이트
        if (entry.target === heroRef.current) {
          setHeroInView(shouldBeVisible);
          console.log('🟡 Hero state updated:', shouldBeVisible);
        } else if (entry.target === secondRef.current) {
          setSecondInView(shouldBeVisible);
          console.log('🟢 Second state updated:', shouldBeVisible);
        } else if (entry.target === thirdRef.current) {
          setThirdInView(shouldBeVisible);
          console.log('🔵 Third state updated:', shouldBeVisible);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 모든 ref가 준비될 때까지 기다린 후 observe 시작
    const observeElements = () => {
      const elements = [
        { ref: heroRef, name: 'Hero' },
        { ref: secondRef, name: 'Second' },
        { ref: thirdRef, name: 'Third' }
      ];

      elements.forEach(({ ref, name }) => {
        if (ref.current) {
          ref.current.dataset.section = name; // 디버깅용 식별자
          observer.observe(ref.current);
          console.log(`✅ ${name} observer attached`);
        } else {
          console.log(`❌ ${name} ref not ready`);
        }
      });
    };

    // DOM이 준비된 후 관찰 시작
    const timer = setTimeout(observeElements, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      console.log('🧹 All observers disconnected');
    };
  }, []); // 의존성 배열을 비워서 한 번만 실행

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 수동 가시성 검사 함수
  const manualVisibilityCheck = useCallback(() => {
    const sections = [
      { ref: heroRef, name: 'Hero', state: heroInView },
      { ref: secondRef, name: 'Second', state: secondInView },
      { ref: thirdRef, name: 'Third', state: thirdInView }
    ];

    sections.forEach(({ ref, name, state }) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        const visibilityPercentage = Math.max(0, Math.min(100, 
          ((window.innerHeight - rect.top) / (window.innerHeight + rect.height)) * 100
        ));

        console.log(`🔍 ${name} Manual Check:`, {
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          height: Math.round(rect.height),
          windowHeight: window.innerHeight,
          isVisible,
          visibilityPercentage: Math.round(visibilityPercentage),
          currentState: state
        });
      }
    });
  }, [heroInView, secondInView, thirdInView]);

  // 3초마다 수동 체크
  useEffect(() => {
    const interval = setInterval(manualVisibilityCheck, 3000);
    return () => clearInterval(interval);
  }, [manualVisibilityCheck]);

  // 디버깅 로그
  console.log('🟡 Hero inView:', heroInView);
  console.log('🟢 Second Section inView:', secondInView);
  console.log('🔵 Third Section inView:', thirdInView);
  console.log('📏 Scroll Y position:', scrollY);

  // Components (간소화)
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
                heroInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transform: `translateY(${scrollY * 0.5}px)`,
              }}
              onClick={() => {
                console.log('🟡 Hero section clicked, inView:', heroInView);
                manualVisibilityCheck();
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
              secondInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            onClick={() => {
              console.log('🟢 Second section clicked, inView:', secondInView);
              manualVisibilityCheck();
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
              thirdInView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            onClick={() => {
              console.log('🔵 Third section clicked, inView:', thirdInView);
              manualVisibilityCheck();
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

      {/* 개선된 디버깅 패널 */}
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
          minWidth: '280px'
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>📊 Debug Panel (Fixed)</div>
        <div>🟡 Hero: {heroInView ? '✅ TRUE' : '❌ FALSE'}</div>
        <div>🟢 Second: {secondInView ? '✅ TRUE' : '❌ FALSE'}</div>
        <div>🔵 Third: {thirdInView ? '✅ TRUE' : '❌ FALSE'}</div>
        <div>📏 Scroll: {Math.round(scrollY)}px</div>
        <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
          <div>Hero Ref: {heroRef.current ? '✅' : '❌'}</div>
          <div>Second Ref: {secondRef.current ? '✅' : '❌'}</div>
          <div>Third Ref: {thirdRef.current ? '✅' : '❌'}</div>
        </div>
        <button 
          onClick={manualVisibilityCheck}
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
          Manual Visibility Check
        </button>
        <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.7 }}>
          Fixed: Single observer, better timing, more tolerant thresholds
        </div>
      </div>
    </div>
  );
};

export default Index;