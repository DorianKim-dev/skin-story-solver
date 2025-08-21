import React, { useEffect, useRef, useState } from 'react';
import { Camera, Search, ArrowRight, ShieldCheck, Timer, Sparkles, MousePointerClick } from 'lucide-react';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  // Simple implementation of useInView hook functionality - 더 강력한 버전
  const useInView = () => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    
    useEffect(() => {
      const el = ref.current;
      console.log('🔧 useInView useEffect - Element:', el); // 디버깅
      
      if (!el) {
        console.log('❌ No element found for IntersectionObserver');
        return;
      }
      
      // 더 관대한 설정으로 변경
      const observer = new IntersectionObserver(
        ([entry]) => {
          console.log('👁️ IntersectionObserver triggered:', {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            boundingClientRect: entry.boundingClientRect,
            target: entry.target.className
          });
          setInView(entry.isIntersecting);
        }, 
        {
          threshold: [0, 0.1, 0.5, 1.0], // 여러 단계에서 감지
          rootMargin: '50px 0px 50px 0px' // 더 넓은 마진
        }
      );
      
      observer.observe(el);
      console.log('✅ Observer attached to element with class:', el.className);
      
      return () => {
        console.log('🧹 Observer disconnected');
        observer.disconnect();
      };
    }, []);
    
    // 추가: 강제로 뷰포트 체크하는 함수
    const checkVisibility = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        console.log('🔍 Manual visibility check:', {
          element: el.className,
          rect: rect,
          isVisible: isVisible,
          windowHeight: window.innerHeight
        });
      }
    };
    
    // 3초마다 수동으로 체크
    useEffect(() => {
      const interval = setInterval(checkVisibility, 3000);
      return () => clearInterval(interval);
    }, []);
    
    return {
      ref,
      inView
    };
  };

  // Scroll handler for parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hero = useInView();
  const secondSection = useInView();
  const thirdSection = useInView();

  // 🔍 디버깅: ref가 제대로 연결되었는지 확인
  useEffect(() => {
    console.log('🔗 Refs check:');
    console.log('Hero ref:', hero.ref.current);
    console.log('Second ref:', secondSection.ref.current);
    console.log('Third ref:', thirdSection.ref.current);
  }, [hero.ref, secondSection.ref, thirdSection.ref]);

  // 🔍 디버깅 1단계: 현재 상태 확인
  console.log('🟡 Hero inView:', hero.inView);
  console.log('🟢 Second Section inView:', secondSection.inView);
  console.log('🔵 Third Section inView:', thirdSection.inView);

  // 🔍 디버깅 2단계: 상태 변화 감시
  useEffect(() => {
    console.log('🔥 Hero inView changed:', hero.inView);
  }, [hero.inView]);

  useEffect(() => {
    console.log('🟢 Second Section inView changed:', secondSection.inView);
  }, [secondSection.inView]);

  useEffect(() => {
    console.log('🔵 Third Section inView changed:', thirdSection.inView);
  }, [thirdSection.inView]);

  // 🔍 디버깅 3단계: 스크롤 위치 확인
  useEffect(() => {
    console.log('📏 Scroll Y position:', scrollY);
  }, [scrollY]);

  const features = [{
    icon: Camera,
    title: '정밀 분석',
    description: '간결한 촬영, 신뢰할 수 있는 결과'
  }, {
    icon: Search,
    title: '전문의 매칭',
    description: '필요할 때 정확한 연결'
  }];

  // Components
  const Button = ({ children, size, className, ...props }) => (
    <button className={className} {...props}>
      {children}
    </button>
  );

  const Section = ({ children, spacing, className, style, ...props }) => (
    <section className={className} style={style} {...props}>
      {children}
    </section>
  );

  const Container = ({ children, size }) => (
    <div className="mx-auto px-6 max-w-7xl">
      {children}
    </div>
  );

  const Typography = ({ variant, children, className }) => (
    <h2 className={className}>{children}</h2>
  );

  const Link = ({ children, to, ...props }) => (
    <a href={to} {...props}>{children}</a>
  );

  return (
    <div className="theme-home-bright min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Fixed Background */}
      <Section 
        spacing="hero" 
        className="relative min-h-screen parallax-section"
        style={{
          backgroundImage: 'url(/lovable-uploads/d89990f8-9655-40af-a548-ce462b0ff981.png)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <Container size="xl">
          <div className="relative z-10 flex items-center justify-center py-20 min-h-screen">
            <div 
              ref={hero.ref} 
              className="w-full max-w-2xl text-center space-y-6 mt-20"
              style={{
                transform: `translateY(${scrollY * 0.5}px)`,
                transition: 'transform 0.1s ease-out'
              }}
              // 🔍 디버깅: 첫 번째 섹션 요소 확인
              onClick={() => console.log('🟡 Hero section clicked, inView:', hero.inView)}
            >
              <div className="text-4xl md:text-6xl text-white font-sans font-bold text-center">
                Diagnose. Match. Heal.
              </div>
              <Typography variant="h2" className="max-w-xl mx-auto text-white/90 text-center">
                AI가 제안하는 당신만의 피부 솔루션
              </Typography>
            </div>
          </div>
        </Container>
      </Section>

      {/* AI 진단 홍보 Section */}
      <Section 
        spacing="hero" 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/e737c29e-2c53-4377-945c-75e21ea3a41d.png)'
        }}
      >
        <Container size="xl">
          <div 
            ref={secondSection.ref}
            className={`flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
              secondSection.inView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            // 🔍 디버깅: 두 번째 섹션 상태 확인
            onClick={() => {
              console.log('🟢 Second section clicked');
              console.log('🟢 Current inView:', secondSection.inView);
              console.log('🟢 Current classes:', secondSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10');
            }}
          >
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
              AI 기술로 종양을 정밀 분석
            </h2>
            <Link to="/camera">
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white font-sans hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg"
              >
                AI 종양 분석하기
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* AI 안면 분석 Section */}
      <Section 
        spacing="hero" 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/3cf38996-cc98-4c21-b772-a8382b1405c8.png)'
        }}
      >
        <Container size="xl">
          <div 
            ref={thirdSection.ref}
            className={`flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
              thirdSection.inView 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            // 🔍 디버깅: 세 번째 섹션 상태 확인 (가장 중요!)
            onClick={() => {
              console.log('🔵 Third section clicked');
              console.log('🔵 Current inView:', thirdSection.inView);
              console.log('🔵 Current classes:', thirdSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10');
              console.log('🔵 Element ref:', thirdSection.ref.current);
            }}
            onMouseEnter={() => console.log('🔵 Mouse entered third section')}
          >
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
              AI 기술로 얼굴을 자동 인식하고 분석
            </h2>
            <Link to="/camera">
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white font-sans hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg"
              >
                AI 안면부 분석하기
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* 🔍 디버깅 패널 (화면 오른쪽 상단에 표시) */}
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
          minWidth: '250px'
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>📊 Debug Panel</div>
        <div>🟡 Hero: {hero.inView ? '✅ TRUE' : '❌ FALSE'}</div>
        <div>🟢 Second: {secondSection.inView ? '✅ TRUE' : '❌ FALSE'}</div>
        <div>🔵 Third: {thirdSection.inView ? '✅ TRUE' : '❌ FALSE'}</div>
        <div>📏 Scroll: {Math.round(scrollY)}px</div>
        <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
          <div>Hero Ref: {hero.ref.current ? '✅' : '❌'}</div>
          <div>Second Ref: {secondSection.ref.current ? '✅' : '❌'}</div>
          <div>Third Ref: {thirdSection.ref.current ? '✅' : '❌'}</div>
        </div>
        <button 
          onClick={() => {
            // 수동 가시성 체크
            [hero, secondSection, thirdSection].forEach((section, index) => {
              const names = ['Hero', 'Second', 'Third'];
              const el = section.ref.current;
              if (el) {
                const rect = el.getBoundingClientRect();
                console.log(`🔍 ${names[index]} Manual Check:`, {
                  top: rect.top,
                  bottom: rect.bottom,
                  height: rect.height,
                  windowHeight: window.innerHeight,
                  isVisible: rect.top < window.innerHeight && rect.bottom > 0
                });
              }
            });
          }}
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
      </div>
    </div>
  );
};

export default Index;