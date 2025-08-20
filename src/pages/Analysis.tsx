import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Sparkles, TrendingUp, AlertCircle, Info, Loader2, RefreshCw, Clock, MapPin, Phone, Globe, MessageCircle, Send, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { aiService, AnalysisResult } from '@/services/aiService';
import { analysisStorage } from '@/utils/analysisStorage';
import { toast } from 'sonner';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFromStorage, setIsFromStorage] = useState(false);
  
  // 챗봇 상태
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([
    {
      id: '1',
      text: '안녕하세요! 피부 분석 결과에 대해 궁금한 점이 있으시면 언제든 물어보세요.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // 이전 페이지에서 전달받은 이미지 데이터
  const uploadedImage = location.state?.image || null;
  const additionalInfo = location.state?.additionalInfo || '';
  const questionnaireData = location.state?.questionnaireData || null;

  useEffect(() => {
    initializeAnalysis();
  }, []);

  const initializeAnalysis = async () => {
    // 먼저 저장된 결과가 있는지 확인
    const storedResult = analysisStorage.getResult();
    
    if (storedResult && !uploadedImage) {
      // 새로운 분석 요청 없이 저장된 결과만 보여주는 경우
      setAnalysisResult(mapStoredToAnalysisResult(storedResult));
      setIsFromStorage(true);
      setIsLoading(false);
      toast.info('저장된 분석 결과를 불러왔습니다.');
      return;
    }

    if (!uploadedImage) {
      // 이미지가 없으면 더미 데이터 표시
      setAnalysisResult(getDummyAnalysisResult());
      setIsLoading(false);
      return;
    }

    // 새로운 분석 실행
    await performAnalysis();
  };

  // 더미 분석 결과 데이터
  const getDummyAnalysisResult = (): AnalysisResult => {
    return {
      predicted_disease: "아토피성 피부염",
      confidence: 87,
      summary: "촬영된 이미지에서 전형적인 아토피성 피부염의 특징이 관찰됩니다. 피부 표면이 거칠고 건조하며, 염증성 병변과 함께 경계가 불분명한 홍반이 확인됩니다. 만성적인 소양감으로 인한 긁힌 자국도 보입니다.",
      recommendation: "보습제를 하루 2-3회 충분히 발라주시고, 긁지 않도록 주의하세요. 증상이 지속되거나 악화될 경우 피부과 전문의 상담을 받으시기 바랍니다. 스테로이드 외용제 사용 시 의사의 처방에 따라 사용하세요.",
      similar_diseases: [
        {
          name: "접촉성 피부염",
          confidence: 72,
          description: "특정 물질에 대한 알레르기 반응으로 인한 피부염으로, 아토피와 유사한 증상을 보일 수 있습니다."
        },
        {
          name: "지루성 피부염",
          confidence: 65,
          description: "주로 피지 분비가 많은 부위에 발생하는 만성 염증성 피부 질환입니다."
        },
        {
          name: "건선",
          confidence: 58,
          description: "은백색 인설을 동반한 홍반성 구진이나 판이 특징적인 만성 염증성 피부 질환입니다."
        }
      ]
    };
  };

  // 더미 병원 추천 데이터
  const getDummyHospitals = () => {
    return [
      {
        name: "서울피부과의원",
        address: "서울특별시 강남구 테헤란로 123",
        phone: "02-1234-5678",
        website: "https://seoulderma.co.kr",
        specialty: "아토피성 피부염, 건선, 습진 전문 치료 / 알레르기성 피부 질환 및 만성 피부염 진료 / 소아 아토피 및 성인 아토피 맞춤 치료 / 피부 보습 관리 및 생활 습관 개선 상담 / 스테로이드 대체 치료법 및 천연 치료 프로그램"
      },
      {
        name: "강남성형외과",
        address: "서울특별시 강남구 역삼로 456",
        phone: "02-2345-6789", 
        website: "https://gangnamclinic.co.kr",
        specialty: "피부미용 레이저 치료 및 흉터 제거 / 보톡스, 필러를 이용한 주름 개선 시술 / 여드름 및 여드름 흉터 전문 치료 / 피부 톤 개선 및 색소 침착 치료 / 안티에이징 프로그램 및 피부 재생 관리"
      }
    ];
  };

  const performAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsFromStorage(false);

      // AI 백엔드 연결 상태 확인
      const isHealthy = await aiService.healthCheck();
      if (!isHealthy) {
        throw new Error('AI 분석 서비스에 연결할 수 없습니다.');
      }

      // 이미지 분석 실행
      const result = await aiService.analyzeImage({
        image: uploadedImage,
        additional_info: additionalInfo,
        questionnaire_data: questionnaireData
      });

      setAnalysisResult(result);
      
      // 분석 결과를 임시 저장
      analysisStorage.saveResult({
        id: analysisStorage.generateResultId(),
        diagnosis: result.predicted_disease || '진단 결과 없음',
        confidence_score: result.confidence,
        recommendations: result.recommendation,
        similar_conditions: result.similar_diseases?.map(d => d.name).join(', '),
        summary: result.summary, // 진단소견 추가
        image: uploadedImage instanceof File ? URL.createObjectURL(uploadedImage) : uploadedImage,
        additionalInfo: additionalInfo,
        questionnaireData: questionnaireData
      });

      toast.success('분석이 완료되었습니다!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('분석 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 저장된 결과를 AnalysisResult 형태로 변환
  const mapStoredToAnalysisResult = (stored: any): AnalysisResult => {
    return {
      predicted_disease: stored.diagnosis,
      confidence: stored.confidence_score || 0,
      summary: stored.summary || '저장된 분석 결과입니다.',
      recommendation: stored.recommendations || '전문의 상담을 권장합니다.',
      similar_diseases: stored.similar_conditions ? 
        stored.similar_conditions.split(', ').map((name: string, index: number) => ({
          name,
          confidence: Math.max(0, (stored.confidence_score || 0) - (index + 1) * 10),
          description: `${name}와 유사한 증상을 보입니다.`
        })) : []
    };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getImageUrl = () => {
    // 저장된 결과에서 온 경우
    if (isFromStorage) {
      const storedResult = analysisStorage.getResult();
      return storedResult?.image || '/placeholder.svg';
    }
    
    // 새로운 분석인 경우
    if (uploadedImage instanceof File) {
      return URL.createObjectURL(uploadedImage);
    }
    
    // 업로드된 이미지가 있는 경우
    if (uploadedImage) {
      return uploadedImage;
    }
    
    // 더미 데이터용 기본 이미지
    return '/icon_14.png';
  };

  // 새로운 분석 시작
  const startNewAnalysis = () => {
    analysisStorage.clearResult();
    navigate('/camera');
  };

  // 챗봇 메시지 전송
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // 간단한 자동 응답 (실제로는 AI API 연결)
    setTimeout(() => {
      const responses = [
        "분석 결과에 대해 더 자세히 설명드리겠습니다.",
        "해당 피부 질환에 대한 추가 정보를 제공해드릴 수 있습니다.",
        "추천 병원에 대한 상세 정보가 필요하시면 말씀해 주세요.",
        "피부 관리 방법에 대해 안내해드릴 수 있습니다."
      ];
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-glass p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-2xl font-bold text-gradient-primary mb-2">AI 분석 중...</h2>
          <p className="text-muted-foreground">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  // 에러 상태 또는 결과 없음
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-glass p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">분석 실패</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="space-y-2">
            <Button onClick={performAnalysis} className="w-full" disabled={!uploadedImage}>
              다시 시도
            </Button>
            <Button variant="outline" onClick={startNewAnalysis} className="w-full">
              새 사진 촬영
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 분석 결과가 없는 경우 (빈 상태)
  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-glass p-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient-primary mb-2">
              피부 분석 결과
            </h1>
            <p className="text-muted-foreground">
              AI 피부 분석을 시작해보세요
            </p>
          </div>

          {/* 빈 상태 카드 */}
          <Card className="glass-card mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-glow rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-4">분석 결과가 없습니다</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                피부 상태를 분석하려면 먼저 사진을 촬영해주세요. 
                AI가 즉시 분석하여 결과를 제공합니다.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={startNewAnalysis}
                  className="w-full max-w-sm mx-auto flex items-center gap-2"
                  size="lg"
                >
                  <Camera className="w-5 h-5" />
                  사진 촬영하기
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/questionnaire')}
                  className="w-full max-w-sm mx-auto"
                >
                  설문조사 먼저 하기
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 기능 소개 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">AI 분석</h3>
                <p className="text-sm text-muted-foreground">
                  고도화된 AI 모델로 정확한 피부 상태 분석
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">신뢰성 점수</h3>
                <p className="text-sm text-muted-foreground">
                  분석 결과의 신뢰도를 백분율로 제공
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Info className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">전문가 추천</h3>
                <p className="text-sm text-muted-foreground">
                  근처 병원 찾기 및 전문의 상담 연결
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 면책조항 */}
          <div className="p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              ※ 본 결과는 AI의 예측값으로 참고용입니다. 정확한 진단은 반드시 전문의의 상담을 받으시기 바랍니다.
              <br />
              본 서비스는 의료진단을 대체하지 않으며, 응급상황 시에는 즉시 병원에 내원하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-glass p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            피부 분석 결과
          </h1>
          <p className="text-muted-foreground">
            AI가 분석한 환부의 상태입니다
          </p>
          <div className="mt-3 flex justify-center gap-2">
            {questionnaireData && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                설문조사 데이터 포함
              </Badge>
            )}
            {isFromStorage && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                저장된 결과
              </Badge>
            )}
            {!uploadedImage && !isFromStorage && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                데모 결과
              </Badge>
            )}
          </div>
        </div>

        {/* 사용자 업로드 이미지와 예상 질환 */}
        <Card className="glass-card mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 업로드된 사진 */}
              <div className="space-y-4 flex flex-col justify-center">
                <h2 className="text-xl font-semibold mb-3 mx-[13px] my-0">분석 이미지</h2>
                <div className="aspect-square bg-gradient-glow rounded-2xl p-3">
                  <div className="w-full h-full bg-white/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={getImageUrl()} 
                      alt="분석 이미지" 
                      className="w-full h-full object-cover rounded-xl" 
                      onError={(e) => {
                        // 이미지 로드 실패시 placeholder 표시
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center text-gray-400 w-full h-full">
                              <div class="w-16 h-16 mb-2">📷</div>
                              <p class="text-sm">이미지 로드 실패</p>
                            </div>
                          `;
                        }
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-white">
                        {uploadedImage ? '환부 촬영' : '샘플 이미지'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* 예상 질환명과 점수 + 진단소견 */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-3">분석 결과</h2>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">예상 질환</h3>
                    <Badge className={getConfidenceColor(analysisResult.confidence)}>
                      {analysisResult.confidence}% 일치
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {analysisResult.predicted_disease}
                  </p>
                  
                  {/* 신뢰도 바 */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">신뢰도</span>
                      <span className="font-semibold">{analysisResult.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${analysisResult.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  {analysisResult.confidence < 70 && (
                    <div className="flex items-center gap-2 text-amber-600 text-sm p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <AlertCircle className="w-4 h-4" />
                      <span>정확한 진단을 위해 전문의 상담을 권장합니다</span>
                    </div>
                  )}
                </div>

                {/* 진단 소견 */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-lg">진단 소견</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                    {analysisResult.summary}
                  </p>
                  <div className="bg-primary-soft/20 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      {analysisResult.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 유사질환 박스 */}
        {analysisResult.similar_diseases && analysisResult.similar_diseases.length > 0 && (
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">유사질환</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.similar_diseases.slice(0, 2).map((item, index) => (
                  <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-primary/40 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {item.confidence}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 병원 추천 */}
        <Card className="glass-card mb-8">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">추천 병원</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getDummyHospitals().map((hospital, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-primary/40 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">{hospital.name}</h3>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                      전문병원
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{hospital.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <a href={`tel:${hospital.phone}`} className="text-sm text-primary hover:underline">
                        {hospital.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <a 
                        href={hospital.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-primary hover:underline"
                      >
                        병원 웹사이트
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">전문 분야</p>
                    <p className="text-sm font-medium text-gray-700">{hospital.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        

        {/* 분석 관련 버튼들 */}
        <div className="mt-6 flex justify-center gap-3">
          <Button 
            onClick={startNewAnalysis}
            size="lg"
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            새 사진 분석
          </Button>

          {analysisStorage.hasResult() && (
            <Button 
              onClick={() => analysisStorage.clearResult()}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              결과 삭제
            </Button>
          )}
        </div>

        {/* 저장된 결과 안내 */}
        {isFromStorage && (
          <div className="mt-4 p-3 bg-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              이 결과는 30분간 임시 저장됩니다. 새로운 분석을 원하시면 '새 사진 분석'을 클릭하세요.
            </p>
          </div>
        )}

        {/* 더미 데이터 안내 */}
        {!uploadedImage && !isFromStorage && (
          <div className="mt-4 p-3 bg-orange-50/80 backdrop-blur-sm rounded-xl border border-orange-200">
            <p className="text-sm text-orange-700 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              현재 데모 결과가 표시되고 있습니다. 실제 분석을 위해서는 사진을 촬영해주세요.
            </p>
          </div>
        )}

        {/* 면책조항 */}
        <div className="mt-8 p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            ※ 본 결과는 AI의 예측값으로 참고용입니다. 정확한 진단은 반드시 전문의의 상담을 받으시기 바랍니다.
            <br />
            본 서비스는 의료진단을 대체하지 않으며, 응급상황 시에는 즉시 병원에 내원하시기 바랍니다.
          </p>
        </div>

        {/* 디버깅 정보 (개발 모드에서만 표시) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 border rounded-lg text-xs">
            <p><strong>디버깅 정보:</strong></p>
            <p>• 이미지: {uploadedImage ? '✅' : '❌'}</p>
            <p>• 추가 정보: {additionalInfo ? '✅' : '❌'}</p>
            <p>• 설문조사 데이터: {questionnaireData ? '✅' : '❌'}</p>
            <p>• 저장된 결과: {analysisStorage.hasResult() ? '✅' : '❌'}</p>
            <p>• 결과 출처: {isFromStorage ? '저장소' : '새 분석'}</p>
            {questionnaireData && (
              <details className="mt-2">
                <summary className="cursor-pointer">설문조사 상세 데이터</summary>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(questionnaireData, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>

      {/* 플로팅 챗봇 버튼 */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-[9999]"
            size="icon"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md h-[500px] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              피부 분석 상담 챗봇
            </DialogTitle>
          </DialogHeader>
          
          {/* 채팅 메시지 영역 */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* 메시지 입력 영역 */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="궁금한 점을 물어보세요..."
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                size="icon"
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analysis;