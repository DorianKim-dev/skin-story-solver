// Hospital 데이터 타입
export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  specialties: string[];
  distance?: number;
  rating?: number;
  reviewCount?: number;
  openHours?: string;
  website?: string;
  description?: string;
  services?: string[];
  features?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  availableToday?: boolean;
  isBookmarked?: boolean;
}

// 검색 파라미터 타입
export interface HospitalSearchParams {
  location?: string;
  specialties?: string[];
  latitude?: number;
  longitude?: number; 
  radius?: number;
  sortBy?: 'distance' | 'rating' | 'name';
  limit?: number;
}

// 검색 결과 타입
export interface HospitalSearchResult {
  hospitals: Hospital[];
  totalCount: number;
  hasMore: boolean;
}

// 현재 위치 가져오기
export const getCurrentLocation = async (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000 }
    );
  });
};

// 샘플 병원 데이터
const sampleHospitals: Hospital[] = [
  {
    id: 1,
    name: '서울피부과의원',
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    specialties: ['여드름', '아토피', '미용피부과'],
    rating: 4.5,
    reviewCount: 156,
    openHours: '09:00 - 18:00',
    coordinates: { lat: 37.5665, lng: 126.9780 },
    availableToday: true
  },
  {
    id: 2,
    name: '강남성형외과',
    address: '서울특별시 강남구 역삼로 456',
    phone: '02-2345-6789',
    specialties: ['보톡스', '필러', '리프팅'],
    rating: 4.3,
    reviewCount: 89,
    openHours: '10:00 - 19:00',
    coordinates: { lat: 37.5000, lng: 127.0270 },
    availableToday: false
  }
];

class HospitalService {
  // 병원 검색
  async searchHospitals(params: HospitalSearchParams): Promise<HospitalSearchResult> {
    // 실제 API 호출 대신 샘플 데이터 반환
    return new Promise((resolve) => {
      setTimeout(() => {
        const hospitals = sampleHospitals.filter(hospital => {
          if (params.specialties && params.specialties.length > 0) {
            return params.specialties.some(specialty => 
              hospital.specialties.includes(specialty)
            );
          }
          return true;
        });

        resolve({
          hospitals,
          totalCount: hospitals.length,
          hasMore: false
        });
      }, 500);
    });
  }

  // 북마크 토글
  async toggleBookmark(hospitalId: number): Promise<{ isBookmarked: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ isBookmarked: Math.random() > 0.5 });
      }, 100);
    });
  }

  // 북마크된 병원 목록
  async getBookmarkedHospitals(): Promise<Hospital[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 100);
    });
  }
}

export const hospitalService = new HospitalService();