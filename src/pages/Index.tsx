import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { Header, Navigation, Hero, Footer } from '@/components/ui/theme-layout';
import { Camera, Search, ArrowRight, ShieldCheck, Timer, Sparkles, MousePointerClick } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
const Index = () => {
  const {
    isAuthenticated,
    logout
  } = useAuthContext();

  const [scrollY, setScrollY] = useState(0);

  // Simple implementation of useInView hook functionality
  const useInView = <T extends HTMLElement,>() => {
    const ref = useRef<T>(null);
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

  const hero = useInView<HTMLDivElement>();
  const secondSection = useInView<HTMLDivElement>();
  const thirdSection = useInView<HTMLDivElement>();
  const features = [{
    icon: Camera,
    title: '정밀 분석',
    description: '간결한 촬영, 신뢰할 수 있는 결과'
  }, {
    icon: Search,
    title: '전문의 매칭',
    description: '필요할 때 정확한 연결'
  }];
  return <div className="theme-home-bright min-h-screen bg-white overflow-x-hidden">
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

      {/* 두 번째 섹션 (배경 고정) */}
<Section 
  spacing="hero" 
  className="relative min-h-screen"
  style={{
    backgroundImage: 'url(/lovable-uploads/second.png)',
    backgroundAttachment: 'fixed', // 🔥 고정
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }}
>
  <Container size="xl">
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 text-white">
      <h2 className="text-3xl font-bold">두 번째 섹션</h2>
      <p className="text-lg">배경은 고정되어 있어요.</p>
    </div>
  </Container>
</Section>

{/* 세 번째 섹션 (일반 배경, 위로 올라오는 느낌) */}
<Section 
  spacing="hero" 
  className="relative min-h-screen bg-black bg-opacity-70"
  style={{
    backgroundImage: 'url(/lovable-uploads/third.png)',
    backgroundAttachment: 'scroll', // ✅ 그냥 따라오는 스크롤
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
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
      <h2 className="text-3xl font-bold text-white">세 번째 섹션</h2>
      <p className="text-lg text-white">아래에서 위로 올라오면서 두 번째 배경을 덮어요.</p>
    </div>
  </Container>
</Section>
    </div>;
};
export default Index;