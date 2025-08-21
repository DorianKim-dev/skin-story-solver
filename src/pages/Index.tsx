import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { useAuthContext } from '@/contexts/AuthContext';
import './index.css'; // 아래 CSS를 index.css에 넣어야 합니다.

const sections = [
  {
    id: 1,
    title: 'Diagnose. Match. Heal.',
    subtitle: 'AI가 제안하는 당신만의 피부 솔루션',
    image: '/lovable-uploads/d89990f8-9655-40af-a548-ce462b0ff981.png',
    buttonText: '',
    link: '',
  },
  {
    id: 2,
    title: 'AI 기술로 종양을 정밀 분석',
    subtitle: '',
    image: '/lovable-uploads/e737c29e-2c53-4377-945c-75e21ea3a41d.png',
    buttonText: 'AI 종양 분석하기',
    link: '/camera',
  },
  {
    id: 3,
    title: 'AI 기술로 얼굴을 자동 인식하고 분석',
    subtitle: '',
    image: '/lovable-uploads/3cf38996-cc98-4c21-b772-a8382b1405c8.png',
    buttonText: 'AI 안면부 분석하기',
    link: '/camera',
  },
];

const Index = () => {
  const { isAuthenticated, logout } = useAuthContext();

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

  const sectionRefs = sections.map(() => useInView<HTMLDivElement>());

  return (
    <div className="scroll-snap-container">
      {sections.map((sec, i) => {
        const { ref, inView } = sectionRefs[i];
        return (
          <section
            key={sec.id}
            ref={ref}
            className="scroll-snap-section relative min-h-screen flex items-center justify-center"
            style={{
              backgroundImage: `url(${sec.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div
                className={`text-center space-y-6 transition-all duration-300 ease-out ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } hover:translate-y-0 hover:opacity-100`}
              >
                <h1 className="text-4xl md:text-6xl text-white font-bold">
                  {sec.title}
                </h1>
                {sec.subtitle && (
                  <Typography variant="h2" className="text-white/90">
                    {sec.subtitle}
                  </Typography>
                )}
                {sec.buttonText && sec.link && (
                  <Link to={sec.link}>
                    <Button className="bg-transparent border-2 border-white text-white px-8 py-4 hover:bg-white hover:text-black transition-all duration-300">
                      {sec.buttonText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Index;
