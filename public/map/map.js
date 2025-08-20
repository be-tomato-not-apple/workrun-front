import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox 토큰 설정
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN_HERE';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(127.7669); // 한국 중심 경도
  const [lat, setLat] = useState(35.9078);  // 한국 중심 위도
  const [zoom, setZoom] = useState(7);

  useEffect(() => {
    // 지도가 이미 초기화되었으면 리턴
    if (map.current) return;

    // 한국 영역 경계 설정
    const southKoreaBounds = [
      [124.5, 33.0], // 남서쪽 (제주도 포함)
      [132.0, 38.9]  // 북동쪽 (동해 포함)
    ];

    // 지도 초기화 (한국만 보이도록)
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 6,    // 한국 전체가 보이는 최소 줌
      maxZoom: 18,   // 최대 줌 레벨
      maxBounds: southKoreaBounds // 한국 영역 제한
    });

    // 지도 이동 시 좌표 업데이트
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // 컴포넌트 언마운트 시 지도 정리
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      {/* 지도 정보 표시 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        fontSize: '12px'
      }}>
        경도: {lng} | 위도: {lat} | 줌: {zoom}
      </div>
      
      {/* 지도 컨테이너 */}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Map;