import React, { useEffect, useRef, useState } from 'react';
import { Camera, Search, ArrowRight, ShieldCheck, Timer, Sparkles, MousePointerClick } from 'lucide-react';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  // Simple implementation of useInView hook functionality
  const useInView = () => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting);
      }, {
        threshold: 0.3
      });
      observer.observe(el);
      return () => observer.disconnect();
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
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}
      >
        <div>🟡 Hero: {hero.inView ? 'TRUE' : 'FALSE'}</div>
        <div>🟢 Second: {secondSection.inView ? 'TRUE' : 'FALSE'}</div>
        <div>🔵 Third: {thirdSection.inView ? 'TRUE' : 'FALSE'}</div>
        <div>📏 Scroll: {Math.round(scrollY)}px</div>
      </div>
    </div>
  );
};

export default Index;