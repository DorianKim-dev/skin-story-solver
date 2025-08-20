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
        threshold: 0.1
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return {
      ref,
      inView
    };
  };
  const hero = useInView<HTMLDivElement>();
  const benefits = useInView<HTMLDivElement>();
  const featuresRef = useInView<HTMLDivElement>();
  const features = [{
    icon: Camera,
    title: '정밀 분석',
    description: '간결한 촬영, 신뢰할 수 있는 결과'
  }, {
    icon: Search,
    title: '전문의 매칭',
    description: '필요할 때 정확한 연결'
  }];
  return <div className="theme-home-bright min-h-screen bg-white snap-y snap-mandatory scroll-root">
      {/* Hero Section - Linear Style */}
      <Section spacing="hero" className="relative snap-start section-animate min-h-screen bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: 'url(/lovable-uploads/d89990f8-9655-40af-a548-ce462b0ff981.png)'
    }}>
        <Container size="xl">
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center py-20 min-h-[60vh]">
            <div ref={hero.ref} className={`w-full max-w-2xl text-center space-y-6 fade-enter ${hero.inView ? 'fade-enter-active' : ''} mt-28 md:mt-40`}>
              {/* Title + Subtitle */}
              <div className="text-4xl md:text-6xl text-white font-sans font-bold text-center">Diagnose. Match. Heal.</div>

              <Typography variant="h2" className="max-w-xl mx-auto text-white/90 text-center">
                AI가 제안하는 당신만의 피부 솔루션
              </Typography>
              
            </div>
          </div>
        </Container>
      </Section>

      {/* AI 진단 홍보 Section */}
      <Section spacing="hero" className="snap-start section-animate relative min-h-screen bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'url(/lovable-uploads/e737c29e-2c53-4377-945c-75e21ea3a41d.png)'
      }}>
        <Container size="xl">
          <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8">
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
      <Section spacing="hero" className="snap-start section-animate relative min-h-screen bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'url(/lovable-uploads/998aef6a-ec7c-44c1-adaf-e0ccde09df4c.png)'
      }}>
        <Container size="xl">
          <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8">
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
    </div>;
};
export default Index;