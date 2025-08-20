import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/theme-typography';
import { Camera as CameraIcon, Upload, RotateCcw, Check, MessageCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCamera } from '@/hooks/useCamera';

const Camera = () => {
  const navigate = useNavigate();
  
  // useCamera 훅 사용
  const {
    isActive,
    error,
    capturedImage,
    deviceInfo,
    faceDetection,
    countdown,
    isConnected,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    manualCapture,
    retake,
    setImageFromFile
  } = useCamera();

  // 디버깅용 - 컴포넌트 마운트 시 디바이스 정보 출력
  useEffect(() => {
    console.log('Camera component mounted');
    console.log('Device info:', deviceInfo);
    console.log('Is camera active:', isActive);
    console.log('Error:', error);
  }, [deviceInfo, isActive, error]);

  // 컴포넌트 언마운트 시 카메라 정지
  useEffect(() => {
    return () => {
      console.log('Camera component unmounting - stopping camera');
      if (isActive) {
        stopCamera();
      }
    };
  }, [isActive, stopCamera]);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImageFromFile(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const isComplete = capturedImage !== null;

  // 사용자 피드백 메시지 렌더링
  const renderFeedbackMessage = () => {
    if (!isActive) return null;
    
    if (deviceInfo?.isDesktop) {
      // 웹에서는 얼굴 감지 상태 표시
      return (
        <div className="mb-6 p-4 bg-card rounded-2xl border border-primary/20 shadow-sm">
          <div className="flex items-center justify-center mb-3">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              isConnected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
            }`} />
            <span className="text-sm font-medium text-foreground">
              {isConnected ? 'AI 얼굴 감지 연결됨' : '연결 중...'}
            </span>
          </div>
          
          <p className="font-medium mb-2 text-center text-foreground">
            {countdown.isActive ? `자동 촬영까지 ${countdown.remaining}초` : '얼굴을 인식하고 있습니다'}
          </p>
          
          <p className="text-sm text-center text-muted-foreground">
            {faceDetection?.feedback || '카메라 앞에 얼굴을 위치시켜 주세요'}
          </p>
          
          {faceDetection && (
            <div className="mt-3 pt-3 border-t border-primary/10">
              <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                <span>감지된 얼굴: {faceDetection.face_count}개</span>
                <span>신뢰도: {(faceDetection.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // 모바일에서는 수동 촬영 안내
      return (
        <div className="mb-6 p-4 bg-card rounded-2xl border border-primary/20 shadow-sm">
          <p className="font-medium mb-2 text-center text-foreground">
            환부를 프레임 안에 맞춰주세요
          </p>
          <p className="text-sm text-center text-muted-foreground">
            아래 촬영 버튼을 눌러 사진을 찍어주세요
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-mint-bright/30 to-coral-soft/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-32 w-80 h-80 bg-gradient-to-tr from-coral-light/30 to-mint-light/40 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-md mx-auto px-6 pt-24 pb-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <CameraIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            환부 촬영
          </h1>
          <p className="text-muted-foreground text-sm">
            정확한 분석을 위해 환부를 선명하게 촬영해주세요
          </p>
        </div>

        {/* 진행 상황 */}
        <div className="flex justify-center mb-8">
          <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
            isComplete 
              ? 'bg-gradient-to-br from-coral-soft to-coral-light shadow-lg' 
              : countdown.isActive
              ? 'bg-gradient-to-br from-primary to-mint-bright shadow-md animate-pulse'
              : 'bg-card border-2 border-primary/20 shadow-sm'
          }`}>
            {isComplete ? (
              <Check className="w-8 h-8 text-white" />
            ) : countdown.isActive ? (
              <span className="text-xl font-bold text-white">{countdown.remaining}</span>
            ) : (
              <CameraIcon className="w-8 h-8 text-primary" />
            )}
            
            {/* Animated ring for countdown */}
            {countdown.isActive && (
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-spin"></div>
            )}
          </div>
        </div>

        {!isComplete ? (
          /* 촬영 화면 */
          <div className="mb-8">
            <div className="relative bg-card rounded-3xl overflow-hidden shadow-xl border border-primary/10">
              <div className="aspect-[3/4] relative">
                {/* 카메라 비디오 스트림 */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${
                    isActive ? 'block' : 'hidden'
                  }`}
                  style={{
                    transform: deviceInfo?.isDesktop ? 'scaleX(-1)' : 'none'
                  }}
                  onError={(e) => {
                    console.error('Video error:', e);
                    toast.error('비디오 스트림 오류가 발생했습니다');
                  }}
                  onLoadedMetadata={() => {
                    console.log('Video metadata loaded');
                    if (videoRef.current) {
                      console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
                    }
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                  width="1280"
                  height="720"
                />
                
                {/* 카메라 비활성 상태 */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-mint-light to-mint-bright/30 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-primary/20">
                        <CameraIcon className="w-10 h-10 text-primary" />
                      </div>
                      <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 shadow-lg">
                        <p className="text-foreground font-medium mb-2">
                          카메라를 시작해주세요
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {deviceInfo ? `${deviceInfo.isDesktop ? '자동 감지 모드' : '수동 촬영 모드'}` : '디바이스 감지 중...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 촬영 가이드 (활성 상태) */}
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Center guide frame */}
                    <div className="relative">
                      <div className="w-64 h-64 border-2 border-dashed border-primary/60 rounded-3xl flex items-center justify-center">
                        {/* Corner indicators */}
                        <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-coral-soft rounded-tl-lg"></div>
                        <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-coral-soft rounded-tr-lg"></div>
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-coral-soft rounded-bl-lg"></div>
                        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-coral-soft rounded-br-lg"></div>
                        
                        {/* Center content */}
                        <div className="text-center">
                          {countdown.isActive ? (
                            <div className="bg-gradient-to-br from-coral-soft to-coral-light rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                              <span className="text-2xl font-bold text-white">{countdown.remaining}</span>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30 shadow-lg">
                              <CameraIcon className="w-8 h-8 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Status message */}
                      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                        <div className="bg-card/95 backdrop-blur-sm rounded-xl px-4 py-2 border border-primary/20 shadow-lg">
                          <p className="text-sm font-medium text-center text-foreground whitespace-nowrap">
                            {countdown.isActive ? '촬영 준비 중...' : 
                             deviceInfo?.isDesktop ? '얼굴 인식 중' : '환부를 프레임에 맞춰주세요'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* 촬영 완료 미리보기 */
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-coral-soft to-coral-light rounded-xl mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground">촬영 완료</h2>
            </div>
            
            <div className="relative bg-card rounded-3xl overflow-hidden shadow-xl border border-primary/10 mb-6">
              <div className="aspect-square relative">
                <img 
                  src={capturedImage} 
                  alt="촬영된 이미지" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-coral-soft to-coral-light text-white border-0">
                    환부 촬영
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border-primary/20 text-primary hover:bg-primary hover:text-white"
                  onClick={retake}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  재촬영
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              환부가 선명하게 촬영되었는지 확인해주세요
            </p>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-destructive font-medium text-sm">{error}</p>
                <p className="text-destructive/70 text-xs mt-1">
                  문제가 지속되면 페이지를 새로고침하거나 브라우저 설정에서 카메라 권한을 확인해주세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 디버깅 정보 (개발 모드에서만 표시) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-gray-50 border rounded-lg text-xs">
            <p><strong>디버깅 정보:</strong></p>
            <p>• 카메라 활성: {isActive ? '✅' : '❌'}</p>
            <p>• 디바이스: {deviceInfo ? `${deviceInfo.isDesktop ? 'Desktop' : deviceInfo.isMobile ? 'Mobile' : 'Tablet'}` : '감지 중...'}</p>
            <p>• WebSocket: {isConnected ? '✅ 연결됨' : '❌ 연결 안됨'}</p>
            <p>• 얼굴 감지: {faceDetection ? `${faceDetection.face_count}개 (신뢰도: ${(faceDetection.confidence * 100).toFixed(1)}%)` : '대기 중'}</p>
            <p>• 비디오 요소: {videoRef.current ? '✅' : '❌'}</p>
            <p>• 스트림 상태: {videoRef.current?.srcObject ? '✅' : '❌'}</p>
          </div>
        )}

        {/* 상태 메시지 */}
        {renderFeedbackMessage()}

        {/* 액션 버튼 */}
        <div className="space-y-4">
          {!isComplete ? (
            <>
              {!isActive ? (
                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-primary to-mint-bright hover:from-primary/90 hover:to-mint-bright/90 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    console.log('Camera start button clicked');
                    startCamera();
                  }}
                >
                  <CameraIcon className="w-6 h-6 mr-3" />
                  카메라 시작
                </Button>
              ) : !deviceInfo?.isDesktop ? (
                // 모바일: 수동 촬영 버튼
                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-coral-soft to-coral-light hover:from-coral-soft/90 hover:to-coral-light/90 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    console.log('Manual capture button clicked');
                    manualCapture();
                  }}
                  disabled={countdown.isActive}
                >
                  <CameraIcon className="w-6 h-6 mr-3" />
                  {countdown.isActive ? `촬영까지 ${countdown.remaining}초` : '촬영하기'}
                </Button>
              ) : (
                // 웹에서 카메라 활성 시 중지 버튼
                <Button 
                  variant="outline"
                  className="w-full h-14 text-lg border-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-white rounded-2xl transition-all duration-300"
                  onClick={() => {
                    console.log('Stop camera button clicked');
                    stopCamera();
                  }}
                >
                  카메라 중지
                </Button>
              )}
              
              {/* 파일 업로드 */}
              {!countdown.isActive && (
                <>
                  <div className="flex items-center justify-center">
                    <div className="flex-grow h-px bg-border"></div>
                    <span className="px-4 text-muted-foreground text-sm">또는</span>
                    <div className="flex-grow h-px bg-border"></div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-primary/30 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all duration-300"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    갤러리에서 선택
                  </Button>
                  
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <Button 
                className="w-full h-16 text-lg bg-gradient-to-r from-coral-soft to-coral-light hover:from-coral-soft/90 hover:to-coral-light/90 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/questionnaire', { state: { image: capturedImage } })}
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                설문조사 후 분석하기
              </Button>
              
              <Button 
                variant="outline"
                className="w-full h-12 text-lg border-2 border-primary/30 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all duration-300"
                onClick={() => navigate('/analysis', { state: { image: capturedImage } })}
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                바로 분석하기
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                설문조사를 통해 더 정확한 분석을 받을 수 있습니다
              </p>
            </div>
          )}
        </div>
        
        {/* 촬영 가이드 */}
        <div className="mt-8 p-5 bg-card rounded-2xl border border-primary/10 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">📸</span>
            </div>
            <h3 className="font-semibold text-foreground">촬영 가이드</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              충분한 조명이 있는 곳에서 촬영해주세요
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              환부가 선명하게 보이도록 가까이서 촬영해주세요
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              손이나 그림자로 가리지 않도록 주의해주세요
            </li>
            {deviceInfo?.isDesktop && (
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-coral-soft rounded-full mt-2 mr-3 flex-shrink-0"></span>
                얼굴이 인식되면 자동으로 3초 후 촬영됩니다
              </li>
            )}
            {!deviceInfo?.isDesktop && (
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-coral-soft rounded-full mt-2 mr-3 flex-shrink-0"></span>
                후면 카메라로 고화질 촬영이 진행됩니다
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Camera;