import React from 'react';
import { Hospital } from '@/services/hospitalServiceSimple';

interface HospitalMapBasicProps {
  hospitals: Hospital[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const HospitalMapBasic = ({ hospitals, center, zoom = 13 }: HospitalMapBasicProps) => {
  return (
    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">지도를 표시하려면 네이버 지도 API가 필요합니다</p>
        <p className="text-sm text-muted-foreground mt-2">
          {hospitals.length}개의 병원이 있습니다
        </p>
      </div>
    </div>
  );
};

export default HospitalMapBasic;