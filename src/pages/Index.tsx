import React, { useEffect, useRef, useState } from 'react';
import { Camera, Search, ArrowRight, ShieldCheck, Timer, Sparkles, MousePointerClick } from 'lucide-react';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  // Simple implementation of useInView hook functionality (기존과 동일)
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

  // Scroll handler for parallax effect (기존과 동일)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hero = useInView();
  const secondSection = useInView();
  const thirdSection = useInView();
  
  const features = [{
    icon: Camera,
    title: '정밀 분석',
    description: '간결한 촬영, 신뢰할 수 있는 결과'
  }, {
    icon: Search,
    title: '전문의 매칭',
    description: '필요할 때 정확한 연결'
  }];

  // 기존 컴포넌트들을 그대로 모방
  const Button = ({ children, className = '', size, ...props }) => (
    <button 
      className={`${size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  const Section = ({ children, className = '', spacing, style, ...props }) => (
    <section 
      className={className} 
      style={style}
      {...props}
    >
      {children}
    </section>
  );

  const Container = ({ children, size = 'xl' }) => (
    <div className={`mx-auto px-6 ${size === 'xl' ? 'max-w-7xl' : 'max-w-4xl'}`}>
      {children}
    </div>
  );

  const Typography = ({ variant, children, className = '' }) => {
    if (variant === 'h2') {
      return <h2 className={className}>{children}</h2>;
    }
    return <p className={className}>{children}</p>;
  };

  const Link = ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  );

  return (
    <div className="theme-home-bright scroll-snap-container min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Fixed Background - 기존과 동일 */}
      <Section 
        spacing="hero" 
        className="scroll-snap-section relative min-h-screen parallax-section"
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

      {/* AI 진단 홍보 Section - 기존과 동일 */}
      <Section 
        spacing="hero" 
        className="scroll-snap-section relative min-h-screen bg-cover bg-center bg-no-repeat"
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

      {/* AI 안면 분석 Section - 기존과 동일 */}
      <Section 
        spacing="hero" 
        className="scroll-snap-section relative min-h-screen bg-cover bg-center bg-no-repeat"
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
    </div>
  );
};

export default Index;