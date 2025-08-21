import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { useAuthContext } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, logout } = useAuthContext();

  // Simple useInView hook
  const useInView = <T extends HTMLElement,>() => {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { threshold: 0.3 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return { ref, inView };
  };

  const hero = useInView<HTMLDivElement>();
  const secondSection = useInView<HTMLDivElement>();
  const thirdSection = useInView<HTMLDivElement>();

  return (
    <div className="theme-home-bright min-h-screen bg-white overflow-x-hidden relative">
      {/* 공통 wrapper: 모든 섹션이 겹쳐지게 absolute */}
      <div className="relative min-h-screen w-full">
        {/* Hero Section */}
        <Section
          spacing="hero"
          ref={hero.ref}
          className={`absolute inset-0 min-h-screen flex items-center justify-center transition-opacity duration-1000 ease-out ${
            hero.inView ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage:
              'url(/lovable-uploads/d89990f8-9655-40af-a548-ce462b0ff981.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Container size="xl">
            <div className="text-center space-y-6">
              <div className="text-4xl md:text-6xl text-white font-sans font-bold">
                Diagnose. Match. Heal.
              </div>
              <Typography
                variant="h2"
                className="max-w-xl mx-auto text-white/90"
              >
                AI가 제안하는 당신만의 피부 솔루션
              </Typography>
            </div>
          </Container>
        </Section>

        {/* Second Section */}
        <Section
          spacing="hero"
          ref={secondSection.ref}
          className={`absolute inset-0 min-h-screen flex items-center justify-center transition-opacity duration-1000 ease-out ${
            secondSection.inView ? 'opacity-100 z-20' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage:
              'url(/lovable-uploads/e737c29e-2c53-4377-945c-75e21ea3a41d.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Container size="xl">
            <div className="text-center space-y-8">
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

        {/* Third Section */}
        <Section
          spacing="hero"
          ref={thirdSection.ref}
          className={`absolute inset-0 min-h-screen flex items-center justify-center transition-opacity duration-1000 ease-out ${
            thirdSection.inView ? 'opacity-100 z-30' : 'opacity-0 z-0'
          }`}
          style={{
            backgroundImage:
              'url(/lovable-uploads/3cf38996-cc98-4c21-b772-a8382b1405c8.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Container size="xl">
            <div className="text-center space-y-8">
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
    </div>
  );
};

export default Index;
