import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, Upload, RotateCcw, Check, MessageCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCamera } from '@/hooks/useCamera';

const Camera = () => {
  const navigate = useNavigate();
  
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
    manualCapture,
    retake,
    setImageFromFile
  } = useCamera();

  useEffect(() => {
    console.log('Camera mounted', { deviceInfo, isActive, error });
  }, [deviceInfo, isActive, error]);

  useEffect(() => {
    return () => {
      if (isActive) stopCamera();
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

  const renderFeedbackMessage = () => {
    if (!isActive) return null;
    
    return (
      <div className="text-center p-4 bg-white rounded-md border border-[#9BB8BB]/30 mb-6 shadow-sm">
        {deviceInfo?.isDesktop ? (
          <>
            <div className="flex items-center justify-center mb-2">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? 'bg-[#9BB8BB] animate-pulse' : 'bg-gray-400'
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected ? 'AI 얼굴 감지 연결됨' : '연결 중...'}
              </span>
            </div>
            <p className="text-[#94AEB1] font-medium mb-2 font-sans">
              {countdown.isActive ? `자동 촬영까지 ${countdown.remaining}초` : '얼굴을 인식하고 있습니다'}
            </p>
            <p className="text-sm text-gray-500 font-sans">
              {faceDetection?.feedback || '카메라 앞에 얼굴을 위치시켜 주세요'}
            </p>
          </>
        ) : (
          <>
            <p className="text-[#94AEB1] font-medium mb-2 font-sans">
              환부를 프레임 안에 맞춰주세요
            </p>
            <p className="text-sm text-gray-500 font-sans">
              아래 촬영 버튼을 눌러 사진을 찍어주세요
            </p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#E8F2F4] p-6">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#94AEB1] hover:text-[#9BB8BB] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium font-sans">돌아가기</span>
          </Link>

          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-[#94AEB1] font-sans">환부 촬영</h1>
            <p className="text-gray-600 font-sans">정확한 분석을 위해 환부를 정면에서 촬영해주세요</p>
          </div>
        </div>

        {/* 진행 상황 */}
        <div className="flex justify-center mb-10">
          <div
            className={`w-14 h-14 rounded-md flex items-center justify-center border-2 transition-all duration-300 ${
              isComplete
                ? 'bg-[#94AEB1] border-[#94AEB1] text-white'
                : countdown.isActive
                ? 'border-[#94AEB1] text-[#94AEB1] bg-[#B5D0D3]/20'
                : 'border-[#9BB8BB]/40 text-[#94AEB1] bg-white shadow-sm'
            }`}
          >
            {isComplete ? (
              <Check className="w-7 h-7" />
            ) : countdown.isActive ? (
              <span className="text-lg font-bold">{countdown.remaining}</span>
            ) : (
              <CameraIcon className="w-7 h-7" />
            )}
          </div>
        </div>

        {!isComplete ? (
          /* 촬영 화면 */
          <div className="mb-8 overflow-hidden">
            <div className="aspect-[4/3] bg-white relative flex items-center justify-center overflow-hidden rounded-md border-2 border-[#B5D0D3]/30">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${
                  isActive ? 'block' : 'hidden'
                }`}
                style={{ transform: deviceInfo?.isDesktop ? 'scaleX(-1)' : 'none' }}
                onError={() => toast.error('비디오 스트림 오류가 발생했습니다')}
              />
              <canvas ref={canvasRef} className="hidden" width="1280" height="720" />
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#E8F2F4]">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#9BB8BB]/20 rounded-md flex items-center justify-center mx-auto mb-4 border border-[#9BB8BB]/30">
                      <CameraIcon className="w-8 h-8 text-[#94AEB1]" />
                    </div>
                    <div className="bg-white rounded-md p-4 border border-[#B5D0D3]/40 shadow-sm">
                      <p className="text-[#94AEB1] font-medium mb-1 font-sans">카메라를 시작해주세요</p>
                      <p className="text-sm text-gray-500 font-sans">
                        {deviceInfo
                          ? `${deviceInfo.isDesktop ? '얼굴 감지 모드로 자동 촬영' : '수동 촬영 모드'}`
                          : '디바이스 감지 중...'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 촬영 완료 미리보기 */
          <div className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold text-center mb-6 text-[#94AEB1] font-sans">촬영 완료</h2>
              <div className="flex justify-center mb-6">
                <div className="relative group max-w-xs">
                  <div className="aspect-square bg-[#E8F2F4] rounded-md p-3 border border-[#B5D0D3]/40">
                    <div className="w-full h-full bg-white rounded-md flex items-center justify-center relative overflow-hidden">
                      <img src={capturedImage!} alt="촬영된 이미지" className="w-full h-full object-cover rounded-md" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#F2B8B3] text-white text-sm font-sans">환부 촬영</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-50 border-[#9BB8BB]/30 text-[#94AEB1] font-sans"
                        onClick={retake}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        재촬영
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-gray-500 font-sans">환부가 선명하게 촬영되었는지 확인해주세요</p>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-[#F5C9C4] border border-[#DC9691] rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-[#DC9691] mr-2 mt-0.5" />
            <div>
              <p className="text-[#DC9691] text-sm font-medium font-sans">{error}</p>
              <p className="text-[#DC9691]/80 text-xs mt-1 font-sans">
                문제가 지속되면 페이지를 새로고침하거나 브라우저 설정에서 카메라 권한을 확인해주세요.
              </p>
            </div>
          </div>
        )}

        {renderFeedbackMessage()}

        {/* 액션 버튼 */}
        <div className="space-y-4">
          {!isComplete ? (
            <>
              {!isActive ? (
                <Button
                  className="w-full h-12 text-lg bg-[#9BB8BB] hover:bg-[#94AEB1] text-white font-sans border-none"
                  onClick={startCamera}
                >
                  <CameraIcon className="w-6 h-6 mr-2" />
                  카메라 시작
                </Button>
              ) : !deviceInfo?.isDesktop ? (
                <Button
                  className="w-full h-12 text-lg bg-[#9BB8BB] hover:bg-[#94AEB1] text-white font-sans border-none"
                  onClick={manualCapture}
                  disabled={countdown.isActive}
                >
                  <CameraIcon className="w-6 h-6 mr-2" />
                  {countdown.isActive ? `촬영까지 ${countdown.remaining}초` : '촬영하기'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg border-red-300 text-red-600 hover:bg-red-50 font-sans"
                  onClick={stopCamera}
                >
                  카메라 중지
                </Button>
              )}

              {!countdown.isActive && (
                <>
                  <div className="text-center">
                    <span className="text-gray-400 text-sm font-sans">또는</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-[#94AEB1] text-[#94AEB1] hover:bg-[#94AEB1] hover:text-white font-sans"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    갤러리에서 선택
                  </Button>
                  <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <Button
                className="w-full h-16 text-lg bg-[#E8A5A0] hover:bg-[#DC9691] text-white font-sans border-none"
                onClick={() => navigate('/questionnaire', { state: { image: capturedImage } })}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                설문조사 후 분석하기
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-lg border-[#94AEB1] text-[#94AEB1] hover:bg-[#94AEB1] hover:text-white font-sans"
                onClick={() => navigate('/analysis', { state: { image: capturedImage } })}
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                바로 분석하기
              </Button>
              <p className="text-xs text-center text-gray-500 font-sans">설문조사를 통해 더 정확한 분석을 받을 수 있습니다</p>
            </div>
          )}

          {isComplete && (
            <Button
              variant="outline"
              className="w-full h-12 text-lg border-[#94AEB1] text-[#94AEB1] hover:bg-[#94AEB1] hover:text-white mt-3 font-sans"
              onClick={retake}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              다시 촬영하기
            </Button>
          )}
        </div>

        {/* 촬영 가이드 */}
        <div className="mt-8 p-4 bg-white rounded-md border border-[#B5D0D3]/40 shadow-sm">
          <h3 className="font-medium text-[#94AEB1] mb-2 font-sans">📸 촬영 가이드</h3>
          <ul className="text-sm text-gray-600 space-y-1 font-sans">
            <li>• 충분한 조명이 있는 곳에서 촬영해주세요</li>
            <li>• 환부가 선명하게 보이도록 가까이서 촬영해주세요</li>
            <li>• 손이나 그림자로 가리지 않도록 주의해주세요</li>
            {deviceInfo?.isDesktop && <li>• 얼굴이 인식되면 자동으로 3초 후 촬영됩니다</li>}
            {!deviceInfo?.isDesktop && <li>• 후면 카메라로 고화질 촬영이 진행됩니다</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Camera;
