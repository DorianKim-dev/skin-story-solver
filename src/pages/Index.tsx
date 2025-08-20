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
  return <div className="theme-home-bright min-h-screen bg-white">
      {/* Hero Section - Full Screen */}
      <Section spacing="hero" className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{
      backgroundImage: 'url(/lovable-uploads/d89990f8-9655-40af-a548-ce462b0ff981.png)'
    }}>
        <Container size="xl">
          {/* Minimal top nav */}
          <div className="absolute top-0 left-0 right-0 grid grid-cols-4 items-center py-4 text-sm text-white/80 z-10">
            <Link to="/camera" className="text-center hover:text-white">Camera</Link>
            <Link to="/analysis" className="text-center hover:text-white">Results</Link>
            <Link to="/profile" className="text-center hover:text-white">My Page</Link>
            {isAuthenticated ? <button onClick={logout} className="text-center hover:text-white">Logout</button> : <Link to="/login" className="text-center hover:text-white">Login</Link>}
          </div>

          {/* Main Content - Centered */}
          <div className="text-center space-y-8">
            <Typography variant="h1" className="text-4xl md:text-6xl text-white font-bold">
              AI로 피부 질환 진단을 빠르고 쉽게 받아보세요
            </Typography>
            
            <Link to="/camera">
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                AI분석하기
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>;
};
export default Index;