// 앱 상태 관리
class MentalHealthApp {
    constructor() {
        this.currentPage = 'main';
        this.userLocation = null;
        this.map = null;
        this.centers = [];
        this.markers = [];
        
        // Mapbox 설정
        this.mapboxToken = 'pk.eyJ1IjoiYmV0b21hdG8iLCJhIjoiY21lam04dzlmMGUzbDJqcTA1MWt0NHp1eiJ9.UjUPxzhAqKCz9kQrnu0_Fw';
        
        this.init();
    }

    init() {
        try {
            console.log('이벤트 리스너 설정 중...');
            this.setupEventListeners();
            
            console.log('목업 데이터 로드 중...');
            this.loadMockData();
            
            console.log('지도 초기화 중...');
            this.initializeMap();
            
            console.log('앱 초기화 완료');
        } catch (error) {
            console.error('초기화 중 오류:', error);
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        try {
            // 페이지 네비게이션
            const mapBtn = document.getElementById('map-btn');
            const navMap = document.getElementById('nav-map');
            const backBtn = document.getElementById('back-btn');
            const navHome = document.getElementById('nav-home');

            if (mapBtn) mapBtn.addEventListener('click', () => this.showMapPage());
            if (navMap) navMap.addEventListener('click', () => this.showMapPage());
            if (backBtn) backBtn.addEventListener('click', () => this.showMainPage());
            if (navHome) navHome.addEventListener('click', () => this.showMainPage());

            // 위치 관련
            const allowLocationBtn = document.getElementById('allow-location-btn');
            const locationBtn = document.getElementById('location-btn');
            
            if (allowLocationBtn) allowLocationBtn.addEventListener('click', () => this.requestLocation());
            if (locationBtn) locationBtn.addEventListener('click', () => this.requestLocation());

            // 응급 버튼
            const emergencyBtn = document.getElementById('emergency-btn');
            const emergencyMapBtn = document.getElementById('emergency-map-btn');
            
            if (emergencyBtn) emergencyBtn.addEventListener('click', () => this.handleEmergency());
            if (emergencyMapBtn) emergencyMapBtn.addEventListener('click', () => this.handleEmergency());

            // 자가진단 버튼
            const diagnosisBtn = document.getElementById('diagnosis-btn');
            if (diagnosisBtn) diagnosisBtn.addEventListener('click', () => this.showDiagnosisPage());

            // 퀵 링크 전화걸기
            document.querySelectorAll('.quick-item').forEach(item => {
                item.addEventListener('click', (e) => this.handleQuickCall(e));
            });

            console.log('이벤트 리스너 설정 완료');
        } catch (error) {
            console.error('이벤트 리스너 설정 실패:', error);
        }
    }

    // 목업 데이터 로드
    loadMockData() {
        this.centers = [
            {
                id: 1,
                name: "서울시 정신건강증진센터",
                address: "서울시 중구 세종대로 110",
                phone: "02-3444-9934",
                lat: 37.5665,
                lng: 126.9780,
                type: "public",
                specialties: ["우울증", "불안장애", "산후우울"]
            },
            {
                id: 2,
                name: "마음편한 정신건강의학과",
                address: "서울시 서초구 반포대로 58",
                phone: "02-587-7582",
                lat: 37.5049,
                lng: 127.0051,
                type: "private",
                specialties: ["산후우울", "육아우울", "불안장애"]
            },
            {
                id: 3,
                name: "강남구 정신건강복지센터",
                address: "서울시 강남구 테헤란로 114길",
                phone: "02-3423-5986",
                lat: 37.5547,
                lng: 127.0583,
                type: "public",
                specialties: ["우울증", "가족상담", "불안장애"]
            }
        ];
    }

    // 지도 초기화
    initializeMap() {
        // Mapbox 토큰이 설정되어 있으면 실제 지도 로드
        if (this.mapboxToken && this.mapboxToken !== 'YOUR_MAPBOX_TOKEN_HERE') {
            this.loadMapbox();
        } else {
            this.showMapPlaceholder();
        }
    }

    // Mapbox 지도 로드
    loadMapbox() {
        try {
            mapboxgl.accessToken = this.mapboxToken;
            
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [127.7669, 35.9078], // 한국 중심
                zoom: 7,
                minZoom: 6,
                maxZoom: 18,
                // 한국 영역으로 제한
                maxBounds: [
                    [124.5, 33.0], // 남서쪽
                    [132.0, 38.9]  // 북동쪽
                ]
            });

            this.map.on('load', () => {
                this.addCenterMarkers();
            });

        } catch (error) {
            console.error('지도 로드 실패:', error);
            this.showMapPlaceholder();
        }
    }

    // 지도 플레이스홀더 표시
    showMapPlaceholder() {
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <div class="map-placeholder-icon">🗺️</div>
                <h3>지도 준비 중</h3>
                <p>Mapbox API 키 설정 후 실제 지도가 표시됩니다</p>
            </div>
        `;
    }

    // 센터 마커 추가
    addCenterMarkers() {
        if (!this.map) return;

        this.centers.forEach(center => {
            const color = center.type === 'public' ? '#4CAF50' : '#2196F3';
            
            const marker = new mapboxgl.Marker({ color })
                .setLngLat([center.lng, center.lat])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                        .setHTML(this.createMarkerPopup(center))
                )
                .addTo(this.map);
            
            this.markers.push(marker);
        });
    }

    // 마커 팝업 HTML 생성
    createMarkerPopup(center) {
        const typeLabel = center.type === 'public' ? '공공기관' : '민간병원';
        const typeColor = center.type === 'public' ? '#4CAF50' : '#2196F3';
        
        return `
            <div style="padding: 12px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${center.name}</h3>
                <div style="margin-bottom: 6px;">
                    <span style="background: ${typeColor}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px;">
                        ${typeLabel}
                    </span>
                </div>
                <p style="margin: 6px 0; color: #666; font-size: 12px;">${center.address}</p>
                <a href="tel:${center.phone}" style="color: #2196F3; text-decoration: none; font-size: 12px;">📞 ${center.phone}</a>
            </div>
        `;
    }

    // 사용자 위치 마커 추가
    addUserMarker(location) {
        if (!this.map) return;

        // 기존 사용자 마커 제거
        if (this.userMarker) {
            this.userMarker.remove();
        }

        this.userMarker = new mapboxgl.Marker({ color: '#FF6B6B' })
            .setLngLat([location.lng, location.lat])
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML('<div style="padding: 10px;"><strong>현재 위치</strong></div>')
            )
            .addTo(this.map);

        // 지도 중심을 사용자 위치로 이동
        this.map.flyTo({
            center: [location.lng, location.lat],
            zoom: 14
        });
    }

    // 페이지 전환
    showMainPage() {
        document.getElementById('main-page').classList.remove('hidden');
        document.getElementById('map-page').classList.add('hidden');
        this.currentPage = 'main';
        this.updateNavigation();
    }

    showMapPage() {
        document.getElementById('main-page').classList.add('hidden');
        document.getElementById('map-page').classList.remove('hidden');
        this.currentPage = 'map';
        this.updateNavigation();
        this.updateCenterList();
        
        // 지도 리사이즈
        if (this.map) {
            setTimeout(() => this.map.resize(), 100);
        }
    }

    showDiagnosisPage() {
        alert('자가진단 기능은 개발 중입니다.');
    }

    // 네비게이션 상태 업데이트
    updateNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        if (this.currentPage === 'main') {
            document.querySelector('#main-page .nav-item').classList.add('active');
        } else if (this.currentPage === 'map') {
            document.querySelector('#map-page .nav-item').classList.add('active');
        }
    }

    // 위치 권한 요청
    async requestLocation() {
        if (!navigator.geolocation) {
            alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
            return;
        }

        try {
            // 로딩 표시
            this.showLocationLoading();

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });

            this.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };

            // UI 업데이트
            this.hideLocationPermission();
            this.calculateDistances();
            this.updateCenterList();
            
            // 지도에 사용자 위치 표시
            if (this.map) {
                this.addUserMarker(this.userLocation);
            }

        } catch (error) {
            this.handleLocationError(error);
        }
    }

    // 위치 로딩 표시
    showLocationLoading() {
        const btn = document.getElementById('allow-location-btn');
        btn.innerHTML = '<div class="spinner"></div>위치 확인 중...';
        btn.disabled = true;
    }

    // 위치 권한 섹션 숨기기
    hideLocationPermission() {
        const permissionDiv = document.getElementById('location-permission');
        if (permissionDiv) {
            permissionDiv.style.display = 'none';
        }
    }

    // 위치 오류 처리
    handleLocationError(error) {
        let message = '위치 정보를 가져올 수 없습니다.';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
                break;
            case error.POSITION_UNAVAILABLE:
                message = '위치 정보를 사용할 수 없습니다.';
                break;
            case error.TIMEOUT:
                message = '위치 정보 요청 시간이 초과되었습니다.';
                break;
        }
        
        alert(message);
        
        // 버튼 복원
        const btn = document.getElementById('allow-location-btn');
        btn.innerHTML = '위치 권한 허용하기';
        btn.disabled = false;
    }

    // 거리 계산
    calculateDistances() {
        if (!this.userLocation) return;

        this.centers.forEach(center => {
            center.distance = this.calculateDistance(
                this.userLocation.lat,
                this.userLocation.lng,
                center.lat,
                center.lng
            );
        });

        // 거리순으로 정렬
        this.centers.sort((a, b) => a.distance - b.distance);
    }

    // 두 지점 간 거리 계산 (km)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // 지구 반지름 (km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // 센터 목록 업데이트
    updateCenterList() {
        const centerList = document.getElementById('center-list');
        const centerCount = document.getElementById('center-count');
        
        centerCount.textContent = this.centers.length;
        
        centerList.innerHTML = this.centers.map(center => this.createCenterCard(center)).join('');
        
        // 이벤트 리스너 추가
        centerList.querySelectorAll('.center-card').forEach((card, index) => {
            card.addEventListener('click', () => this.selectCenter(this.centers[index]));
        });
    }

    // 센터 카드 HTML 생성
    createCenterCard(center) {
        const typeLabel = center.type === 'public' ? '공공' : '민간';
        const typeClass = center.type === 'public' ? 'public' : 'private';
        const distanceText = center.distance ? 
            `📍 ${center.distance.toFixed(1)}km` : 
            '📍 거리 계산 중';

        return `
            <div class="center-card" data-id="${center.id}">
                <div class="center-header">
                    <div>
                        <h4 class="center-name">${center.name}</h4>
                        <div class="center-badges">
                            <span class="center-badge ${typeClass}">${typeLabel}</span>
                        </div>
                    </div>
                </div>
                <div class="center-info">${center.address}</div>
                <div class="center-info center-distance">${distanceText}</div>
                <div class="center-actions">
                    <button class="center-action-btn call" onclick="window.location.href='tel:${center.phone}'">
                        📞 ${center.phone}
                    </button>
                    <button class="center-action-btn directions" onclick="app.openDirections(${center.lat}, ${center.lng})">
                        🗺️ 길찾기
                    </button>
                </div>
            </div>
        `;
    }

    // 센터 선택
    selectCenter(center) {
        if (this.map) {
            this.map.flyTo({
                center: [center.lng, center.lat],
                zoom: 16
            });
        }
    }

    // 길찾기 열기
    openDirections(lat, lng) {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(googleMapsUrl, '_blank');
    }

    // 응급상황 처리
    handleEmergency() {
        const emergencyNumbers = [
            '응급상담: 1577-0199',
            '생명의전화: 1588-9191',
            '청소년전화: 1388',
            '응급실: 119'
        ];
        
        if (confirm('응급상황입니다. 전문 상담사와 연결하거나 응급실로 안내해드릴까요?\n\n' + emergencyNumbers.join('\n'))) {
            window.location.href = 'tel:1577-0199';
        }
    }

    // 퀵 콜 처리
    handleQuickCall(event) {
        const numberElement = event.currentTarget.querySelector('.quick-number');
        if (numberElement) {
            const number = numberElement.textContent;
            window.location.href = `tel:${number}`;
        }
    }
}

// DOM 로드 완료 후 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('앱 초기화 시작...');
        window.app = new MentalHealthApp();
        console.log('앱 초기화 완료');
    } catch (error) {
        console.error('앱 초기화 실패:', error);
        alert('앱 로드 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
    }
});

// 전역 에러 핸들러
window.addEventListener('error', (event) => {
    console.error('전역 에러:', event.error);
});

// Promise 에러 핸들러
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise 에러:', event.reason);
});

// PWA 지원을 위한 서비스 워커 등록 (선택사항)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW 등록 성공:', registration);
            })
            .catch(error => {
                console.log('SW 등록 실패:', error);
            });
    });
}