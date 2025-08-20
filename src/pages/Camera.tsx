import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/theme-typography';
import { Upload, RotateCcw, Check, MessageCircle, AlertCircle, ArrowLeft } from 'lucide-react';
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
      reader.onload = e => {
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
      return <div className="text-center p-4 bg-white rounded-xl mb-6 shadow-sm" style={{
        borderColor: '#333333',
        borderWidth: '1px'
      }}>
          <div className="flex items-center justify-center mb-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'animate-pulse' : ''}`} style={{
            backgroundColor: isConnected ? '#333333' : '#999999'
          }} />
            <span className="text-sm font-sans" style={{
            color: '#333333'
          }}>
              {isConnected ? 'AI 얼굴 감지 연결됨' : '연결 중...'}
            </span>
          </div>
          
          <p className="font-medium mb-2 font-sans" style={{
          color: '#333333'
        }}>
            {countdown.isActive ? `자동 촬영까지 ${countdown.remaining}초` : '얼굴을 인식하고 있습니다'}
          </p>
          
          <p className="text-sm font-sans" style={{
          color: '#333333'
        }}>
            {faceDetection?.feedback || '카메라 앞에 얼굴을 위치시켜 주세요'}
          </p>
          
          {faceDetection && <div className="mt-2 text-xs text-gray-400">
              감지된 얼굴: {faceDetection.face_count}개 | 
              신뢰도: {(faceDetection.confidence * 100).toFixed(1)}%
            </div>}
        </div>;
    } else {
      // 모바일에서는 수동 촬영 안내
      return <div className="text-center p-4 bg-white rounded-xl mb-6 shadow-sm" style={{
        borderColor: '#333333',
        borderWidth: '1px'
      }}>
          <p className="font-medium mb-2 font-sans" style={{
          color: '#333333'
        }}>
            환부를 프레임 안에 맞춰주세요
          </p>
          <p className="text-sm font-sans" style={{
          color: '#333333'
        }}>
            아래 촬영 버튼을 눌러 사진을 찍어주세요
          </p>
        </div>;
    }
  };
  return <div className="min-h-screen p-6 pt-20 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold font-sans" style={{
            color: '#333333'
          }}>
              환부 촬영
            </h1>
            <p className="font-sans" style={{
            color: '#333333'
          }}>
              정확한 분석을 위해 환부를 정면에서 촬영해주세요
            </p>
          </div>
        </div>

        {/* 진행 상황 */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center">
            
          </div>
        </div>

        {!isComplete ? (/* 촬영 화면 */
      <div className="mb-8 overflow-hidden">
            <div className="aspect-[4/3] bg-gray-50 relative flex items-center justify-center overflow-hidden rounded-2xl border-2 border-[#759393]/20">
              {/* 실제 카메라 비디오 스트림 */}
              <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover transform ${isActive ? 'block' : 'hidden'}`} style={{
            transform: deviceInfo?.isDesktop ? 'scaleX(-1)' : 'none' // 전면 카메라 미러링
          }} onError={e => {
            console.error('Video error:', e);
            toast.error('비디오 스트림 오류가 발생했습니다');
          }} onLoadedMetadata={() => {
            console.log('Video metadata loaded');
            if (videoRef.current) {
              console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
            }
          }} />
              <canvas ref={canvasRef} className="hidden" width="1280" height="720" />
              
              {/* 카메라가 비활성 상태일 때 */}
              {!isActive && <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    
                    <div className="bg-white rounded-lg p-4 border border-[#759393]/20 shadow-sm">
                      <p className="text-[#759393] font-medium mb-1 font-sans">
                        카메라를 시작해주세요
                      </p>
                      <p className="text-sm text-gray-500 font-sans">
                        {deviceInfo ? `${deviceInfo.isDesktop ? '얼굴 감지 모드로 자동 촬영' : '수동 촬영 모드'}` : '디바이스 감지 중...'}
                      </p>
                    </div>
                  </div>
                </div>}

              {/* 웹에서의 얼굴 감지 가이드라인 */}
              {deviceInfo?.isDesktop && isActive && <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-72 h-72 border-2 border-dashed border-[#759393]/60 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      {countdown.isActive ? <div className="bg-[#759393]/90 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-white/50">
                          <span className="text-3xl font-bold text-white">{countdown.remaining}</span>
                        </div> : <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                          <div className="w-8 h-8 rounded bg-gray-300"></div>
                        </div>}
                      
                      <div className="bg-white/95 rounded-lg p-4 border border-[#759393]/20 max-w-xs shadow-sm">
                        <p className="text-[#759393] font-medium mb-1 font-sans">
                          {countdown.isActive ? '촬영 준비 중...' : '얼굴 인식 중'}
                        </p>
                        <p className="text-sm text-gray-500 font-sans">
                          {faceDetection?.feedback || '얼굴을 카메라 앞에 위치시켜 주세요'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>}

              {/* 모바일에서의 촬영 가이드 */}
              {!deviceInfo?.isDesktop && isActive && <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-80 h-80 border-2 border-dashed border-[#759393]/60 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                        <div className="w-8 h-8 rounded bg-gray-300"></div>
                      </div>
                      <div className="bg-white/95 rounded-lg p-4 border border-[#759393]/20 shadow-sm">
                        <p className="text-[#759393] font-medium mb-1 font-sans">
                          환부를 프레임 안에 맞춰주세요
                        </p>
                        <p className="text-sm text-gray-500 font-sans">
                          촬영 버튼을 눌러 사진을 찍어주세요
                        </p>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
          </div>) : (/* 촬영 완료 미리보기 */
      <div className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold text-center mb-6 text-[#759393] font-sans">촬영 완료</h2>
              <div className="flex justify-center mb-6">
                <div className="relative group max-w-xs">
                  <div className="aspect-square bg-[#759393]/10 rounded-2xl p-3 border border-[#759393]/20">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center relative overflow-hidden">
                      <img src={capturedImage} alt="촬영된 이미지" className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#759393] text-white text-sm font-sans">
                          환부 촬영
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-50 border-[#759393]/30 text-[#759393] font-sans" onClick={retake}>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        재촬영
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 font-sans">
                  환부가 선명하게 촬영되었는지 확인해주세요
                </p>
              </div>
            </div>
          </div>)}

        {/* 에러 메시지 */}
        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <p className="text-red-700 text-sm font-medium font-sans">{error}</p>
              <p className="text-red-600 text-xs mt-1 font-sans">
                문제가 지속되면 페이지를 새로고침하거나 브라우저 설정에서 카메라 권한을 확인해주세요.
              </p>
            </div>
          </div>}

        {/* 디버깅 정보 (개발 모드에서만 표시) */}
        {process.env.NODE_ENV === 'development' && <div className="mb-4 p-3 bg-gray-50 border rounded-lg text-xs">
            <p><strong>디버깅 정보:</strong></p>
            <p>• 카메라 활성: {isActive ? '✅' : '❌'}</p>
            <p>• 디바이스: {deviceInfo ? `${deviceInfo.isDesktop ? 'Desktop' : deviceInfo.isMobile ? 'Mobile' : 'Tablet'}` : '감지 중...'}</p>
            <p>• WebSocket: {isConnected ? '✅ 연결됨' : '❌ 연결 안됨'}</p>
            <p>• 얼굴 감지: {faceDetection ? `${faceDetection.face_count}개 (신뢰도: ${(faceDetection.confidence * 100).toFixed(1)}%)` : '대기 중'}</p>
            <p>• 비디오 요소: {videoRef.current ? '✅' : '❌'}</p>
            <p>• 스트림 상태: {videoRef.current?.srcObject ? '✅' : '❌'}</p>
          </div>}

        {/* 상태 메시지 */}
        {renderFeedbackMessage()}

        {/* 액션 버튼 */}
        <div className="space-y-4">
          {!isComplete ? <>
              {!isActive ? <Button className="w-full h-12 text-lg text-white font-sans border-none hover:opacity-90" style={{
            backgroundColor: '#333333'
          }} onClick={() => {
            console.log('Camera start button clicked');
            startCamera();
          }}>
                  카메라 시작
                </Button> : !deviceInfo?.isDesktop ?
          // 모바일: 수동 촬영 버튼
          <Button className="w-full h-12 text-lg text-white font-sans border-none hover:opacity-90" style={{
            backgroundColor: '#333333'
          }} onClick={() => {
            console.log('Manual capture button clicked');
            manualCapture();
          }} disabled={countdown.isActive}>
                  {countdown.isActive ? `촬영까지 ${countdown.remaining}초` : '촬영하기'}
                </Button> :
          // 웹에서 카메라 활성 시 중지 버튼 추가
          <Button variant="outline" className="w-full h-12 text-lg border-red-300 text-red-600 hover:bg-red-50 font-sans" onClick={() => {
            console.log('Stop camera button clicked');
            stopCamera();
          }}>
                  카메라 중지
                </Button>}
              
              {/* 파일 업로드는 모든 플랫폼에서 사용 가능 */}
              {!countdown.isActive && <>
                  <div className="text-center">
                    <span className="text-gray-400 text-sm font-sans">또는</span>
                  </div>
                  
                  <Button variant="outline" className="w-full h-12 font-sans" style={{
              borderColor: '#333333',
              color: '#333333'
            }} onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#333333';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#333333';
            }} onClick={() => document.getElementById('file-input')?.click()}>
                    <Upload className="w-5 h-5 mr-2" />
                    갤러리에서 선택
                  </Button>
                  
                  <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </>}
            </> : <div className="space-y-3">
              <Button className="w-full h-16 text-lg text-white font-sans border-none hover:opacity-90" style={{
            backgroundColor: '#333333'
          }} onClick={() => navigate('/questionnaire', {
            state: {
              image: capturedImage
            }
          })}>
                <MessageCircle className="w-5 h-5 mr-2" />
                설문조사 후 분석하기
              </Button>
              
              <Button variant="outline" className="w-full h-12 text-lg font-sans hover:text-white" style={{
            borderColor: '#333333',
            color: '#333333'
          }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333333'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => navigate('/analysis', {
            state: {
              image: capturedImage
            }
          })}>
                바로 분석하기
              </Button>
              
              <p className="text-xs text-center text-gray-500 font-sans">
                설문조사를 통해 더 정확한 분석을 받을 수 있습니다
              </p>
            </div>}
          
          {/* 재촬영 버튼 (촬영 완료 시에만 표시) */}
          {isComplete && <Button variant="outline" className="w-full h-12 text-lg border-[#759393] text-[#759393] hover:bg-[#759393] hover:text-white mt-3 font-sans" onClick={() => {
          console.log('Retake button clicked');
          retake();
        }}>
              <RotateCcw className="w-5 h-5 mr-2" />
              다시 촬영하기
            </Button>}
        </div>
        
        {/* 촬영 가이드 */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-[#759393]/20 shadow-sm">
          <h3 className="font-medium text-[#759393] mb-2 font-sans">촬영 가이드</h3>
          <ul className="text-sm text-gray-600 space-y-1 font-sans">
            <li>• 충분한 조명이 있는 곳에서 촬영해주세요</li>
            <li>• 환부가 선명하게 보이도록 가까이서 촬영해주세요</li>
            <li>• 손이나 그림자로 가리지 않도록 주의해주세요</li>
            {deviceInfo?.isDesktop && <li>• 얼굴이 인식되면 자동으로 3초 후 촬영됩니다</li>}
            {!deviceInfo?.isDesktop && <li>• 후면 카메라로 고화질 촬영이 진행됩니다</li>}
          </ul>
        </div>
      </div>
    </div>;
};
export default Camera;