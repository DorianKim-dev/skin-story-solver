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
          {/* Minimal top nav with equal spacing */}
          <div className="grid grid-cols-4 items-center py-4 text-sm text-white/80">
            <Link to="/camera" className="text-center hover:text-white">Camera</Link>
            <Link to="/analysis" className="text-center hover:text-white">Results</Link>
            <Link to="/profile" className="text-center hover:text-white">My Page</Link>
            {isAuthenticated ? <button onClick={logout} className="text-center hover:text-white">Logout</button> : <Link to="/login" className="text-center hover:text-white">Login</Link>}
          </div>

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
      <Section spacing="lg" className="snap-start section-animate relative min-h-screen bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'url(/lovable-uploads/4b880f1c-82a6-4d57-b319-c498801381b7.png)'
      }}>
        <Container size="xl">
          <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white">
              AI로 피부 질환 진단을 빠르고 쉽게 받아보세요
            </h2>
            <Link to="/camera">
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white font-sans hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg"
              >
                AI분석하기
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Trust + Features Section */}
      <Section spacing="default" background="gradient" className="snap-start section-animate">
        <Container size="xl">
          <div className="text-center mb-16 space-y-4">
            <Typography variant="h3">전문적인 피부 케어 솔루션</Typography>
            <Typography variant="subtitle" className="max-w-2xl mx-auto">
              AI 분석부터 병원 추천까지 통합적인 피부 관리 서비스
            </Typography>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20">
                의료적 신뢰도
              </div>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20">
                데이터 보호
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => <div key={index} className="group">
                <div className="bg-card rounded-xl p-8 h-full border border-border hover:border-primary/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Typography variant="h4" className="mb-4 text-foreground">
                    {feature.title}
                  </Typography>
                  <Typography variant="bodySmall" className="leading-relaxed">
                    {feature.description}
                  </Typography>
                </div>
              </div>)}
          </div>
        </Container>
      </Section>
    </div>;
};
export default Index;