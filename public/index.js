// 진단 테스트 질문 데이터
const questions = [
    {
        question: "Q1.<br> 예전과 비교했을 때,<br>일상에서 재미있는 일에 웃을 수 있었나요?",
        options: [
            { text: "네, 예전과 비슷했어요", value: 0 },
            { text: "예전보다 줄은 것 같아요", value: 1 },
            { text: "예전보다 많이 줄었어요", value: 2 },
            { text: "전혀 웃을 수 없었어요", value: 3 }
        ]
    },
    {
        question: "Q2.<br> 최근 즐거운 일을<br>기대하는 마음이 있었나요?",
        options: [
            { text: "네, 예전과 비슷했어요", value: 0 },
            { text: "예전보다 줄은 것 같아요", value: 1 },
            { text: "예전보다 많이 줄었어요", value: 2 },
            { text: "아뇨, 거의 그렇지 않았어요", value: 3 }
        ]
    },
    {
        question: "Q3.<br> 일이 잘못될 때<br>괜히 나 자신을 탓하곤 했나요?",
        options: [
            { text: "전혀 그렇지 않았어요", value: 0 },
            { text: "거의 그렇지 않았어요", value: 1 },
            { text: "가끔 그랬어요", value: 2 },
            { text: "자주 그랬어요", value: 3 }
        ]
    },
    {
        question: "Q4.<br> 특별한 이유가 없어도<br>불안하거나 걱정된 적이 있었나요?",
        options: [
            { text: "전혀 그렇지 않았어요", value: 0 },
            { text: "거의 그렇지 않았어요", value: 1 },
            { text: "가끔 그랬어요", value: 2 },
            { text: "자주 그랬어요", value: 3 }
        ]
    },
    {
        question: "Q5.<br> 특별한 이유 없이<br>두렵거나 무서운 적이 있었나요?",
        options: [
            { text: "전혀 없었어요", value: 0 },
            { text: "거의 없었어요", value: 1 },
            { text: "가끔 있었어요", value: 2 },
            { text: "자주 있었어요", value: 3 }
        ]
    },
    {
        question: "Q6.<br> 요즘 들어 일이나 해야 할 일들이<br>버겁게 느껴졌나요?",
        options: [
            { text: "전혀요, 평소처럼 잘 해냈어요", value: 0 },
            { text: "아니요, 대체로 해낼 수 있었어요", value: 1 },
            { text: "가끔요, 평소처럼은 힘들었어요", value: 2 },
            { text: "자주요, 해야 할 일을 하기 어려웠어요", value: 3 }
        ]
    },
    {
        question: "Q7.<br> 너무 불행하다고 생각해서<br>잠을 잘 이루지 못한 적이 있었나요?",
        options: [
            { text: "전혀 없었어요", value: 0 },
            { text: "가끔 있었어요", value: 1 },
            { text: "거의 없었어요", value: 2 },
            { text: "자주 있었어요", value: 3 }
        ]
    },
    {
        question: "Q8.<br> 슬프거나 비참하다고<br>느낀 적이 있었나요?",
        options: [
            { text: "전혀 없었어요", value: 0 },
            { text: "거의 없었어요", value: 1 },
            { text: "가끔 있었어요", value: 2 },
            { text: "자주 있었어요", value: 3 }
        ]
    },
    {
        question: "Q9.<br> 불행하다고 느껴<br>눈물이 난 적이 있었나요?",
        options: [
            { text: "전혀 없었어요", value: 0 },
            { text: "가끔 있었어요", value: 1 },
            { text: "자주 있었어요", value: 2 },
            { text: "거의 매일 그랬어요", value: 3 }
        ]
    },
    {
        question: "Q10.<br> 스스로를 해치고 싶은<br>생각이 든 적 있었나요?",
        options: [
            { text: "전혀 없었어요", value: 0 },
            { text: "거의 없었어요", value: 1 },
            { text: "가끔 있었어요", value: 2 },
            { text: "자주 있었어요", value: 3 }
        ]
    }
];

// 통합된 정신건강 앱 클래스
class MentalHealthApp {
    constructor() {
        this.currentPage = 'main';
        this.userLocation = null;
        this.map = null;
        this.centers = [];
        this.markers = [];
        this.locationPermissionGranted = false;
        
        // 진단 테스트 관련 상태
        this.currentQuestion = 0;
        this.answers = [];
        this.totalScore = 0;
        
        // Mapbox 설정
        this.mapboxToken = 'pk.eyJ1IjoiYmV0b21hdG8iLCJhIjoiY21lam04dzlmMGUzbDJqcTA1MWt0NHp1eiJ9.UjUPxzhAqKCz9kQrnu0_Fw';
        
        this.init();
    }

    init() {
        try {
            console.log('앱 초기화 시작...');
            this.setupEventListeners();
            this.loadMockData();
            this.initializeMap();
            this.setupImageErrorHandling();
            this.checkLocationPermission();
            console.log('앱 초기화 완료');
        } catch (error) {
            console.error('초기화 중 오류:', error);
        }
    }

    // 위치 권한 확인
    checkLocationPermission() {
        if (navigator.permissions) {
            navigator.permissions.query({name: 'geolocation'}).then((permission) => {
                if (permission.state === 'granted') {
                    this.locationPermissionGranted = true;
                    this.hideLocationConsent();
                } else {
                    // 위치정보 카드가 확실히 보이도록 강제 표시
                    this.showLocationConsentCard();
                }
            });
        } else {
            // 권한 API가 없으면 카드 표시
            this.showLocationConsentCard();
        }
    }

    // 위치정보 카드 강제 표시
    showLocationConsentCard() {
        const consentCard = document.getElementById('location-consent-card');
        if (consentCard) {
            consentCard.style.display = 'block';
            consentCard.classList.remove('hidden');
            console.log('위치정보 카드 표시됨');
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        try {
            // 페이지 네비게이션
            const testBtn = document.getElementById('test-btn');
            const navMap = document.getElementById('nav-map');
            const backBtn = document.getElementById('back-btn');
            const navHome = document.getElementById('nav-home');
            const navDiagnosis = document.getElementById('nav-diagnosis');

            if (testBtn) testBtn.addEventListener('click', () => this.showDiagnosisPage());
            if (navDiagnosis) navDiagnosis.addEventListener('click', () => this.showDiagnosisPage());
            if (navMap) navMap.addEventListener('click', () => this.showMapPage());
            if (backBtn) backBtn.addEventListener('click', () => this.showMainPage());
            if (navHome) navHome.addEventListener('click', () => this.showMainPage());

            // 진단 테스트 관련
            const closeTestBtn = document.getElementById('close-test-btn');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            
            if (closeTestBtn) closeTestBtn.addEventListener('click', () => this.showMainPage());
            if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());

            // 닫기 버튼들 (결과 페이지)
            document.querySelectorAll('.close-btn').forEach(btn => {
                if (btn.id !== 'close-test-btn') {
                    btn.addEventListener('click', () => this.showMainPage());
                }
            });

            // 테스트 다시 하기 버튼들
            document.querySelectorAll('.action-btn').forEach(btn => {
                if (btn.textContent.includes('테스트 다시 하기')) {
                    btn.addEventListener('click', () => {
                        this.resetTest();
                        this.showTestSection();
                    });
                }
            });

            // 메인 페이지 위치정보 동의
            const mainLocationBtn = document.getElementById('main-location-btn');
            const skipLocationBtn = document.getElementById('skip-location-btn');
            
            if (mainLocationBtn) mainLocationBtn.addEventListener('click', () => this.requestLocationFromMain());
            if (skipLocationBtn) skipLocationBtn.addEventListener('click', () => this.hideLocationConsent());

            // 위치 관련 (지도 페이지)
            const locationBtn = document.getElementById('location-btn');
            if (locationBtn) locationBtn.addEventListener('click', () => this.requestLocation());

            // 응급 버튼
            const emergencyMapBtn = document.getElementById('emergency-map-btn');
            if (emergencyMapBtn) emergencyMapBtn.addEventListener('click', () => this.handleEmergency());

            // 검색 기능
            const searchInput = document.querySelector('.search-input');
            const searchBtn = document.querySelector('.search-button');
            
            if (searchInput) {
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.goToSearchPage(e.target.value);
                    }
                });
            }
            
            if (searchBtn) searchBtn.addEventListener('click', () => {
                const query = searchInput?.value || '';
                this.goToSearchPage(query);
            });

            // 필터 버튼들
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.handleFilterClick(e));
            });

            // 북마크 버튼들
            document.querySelectorAll('.bookmark-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.handleBookmarkClick(e));
            });

            // 복지 카드 클릭
            document.querySelectorAll('.welfare-card').forEach(card => {
                card.addEventListener('click', (e) => this.handleWelfareCardClick(e));
            });

            // 더 많은 복지 보기 버튼
            const viewMoreBtn = document.getElementById('view-more-welfare');
            if (viewMoreBtn) {
                viewMoreBtn.addEventListener('click', () => this.goToSearchPage());
            }

            // 홈 네비게이션 버튼 (첫 번째 nav-item)
            const homeNavBtn = document.querySelector('.nav-item');
            if (homeNavBtn) {
                homeNavBtn.addEventListener('click', () => this.showMainPage());
            }

            console.log('이벤트 리스너 설정 완료');
        } catch (error) {
            console.error('이벤트 리스너 설정 실패:', error);
        }
    }

    // ========== 위치 관련 메서드 ==========
    
    // 메인 페이지에서 위치 권한 요청
    async requestLocationFromMain() {
        if (!navigator.geolocation) {
            alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
            return;
        }

        try {
            this.showMainLocationLoading();

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

            this.locationPermissionGranted = true;
            this.showLocationSuccess();
            this.calculateDistances();

        } catch (error) {
            this.handleMainLocationError(error);
        }
    }

    showMainLocationLoading() {
        const btn = document.getElementById('main-location-btn');
        if (btn) {
            btn.innerHTML = '<div class="spinner"></div>위치 확인 중...';
            btn.disabled = true;
        }
    }

    showLocationSuccess() {
        const consentSection = document.querySelector('.location-consent-section');
        if (consentSection) {
            consentSection.classList.add('completed');
            consentSection.innerHTML = `
                <div class="consent-card">
                    <div class="consent-icon">✅</div>
                    <h3>위치 권한이 허용되었습니다</h3>
                    <p>이제 주변 정신건강센터를 찾을 수 있습니다</p>
                </div>
            `;
            
            // 3초 후 자동으로 숨기기
            setTimeout(() => {
                this.hideLocationConsent();
            }, 1000);
        }
    }

    handleMainLocationError(error) {
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
        
        const btn = document.getElementById('main-location-btn');
        if (btn) {
            btn.innerHTML = '위치 권한 허용하기';
            btn.disabled = false;
        }
    }

    hideLocationConsent() {
        const consentSection = document.querySelector('.location-consent-section');
        if (consentSection) {
            consentSection.classList.add('hidden');
        }
    }

    // ========== 검색/복지 관련 메서드 ==========
    
    // search.html로 이동
    goToSearchPage(query = '') {
        let url = 'search.html';
        if (query.trim()) {
            url += `?q=${encodeURIComponent(query)}`;
        }
        window.location.href = url;
    }

    handleFilterClick(event) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        const category = event.target.dataset.category || 'family';
        this.goToSearchPage(`category=${category}`);
    }

    handleBookmarkClick(event) {
        event.stopPropagation();
        const btn = event.currentTarget;
        
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16 18L10 13L4 18V4C4 2.9 4.9 2 6 2H14C15.1 2 16 2.9 16 4V18Z" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
        } else {
            btn.classList.add('active');
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16 18L10 13L4 18V4C4 2.9 4.9 2 6 2H14C15.1 2 16 2.9 16 4V18Z" fill="currentColor"/>
                </svg>
            `;
        }
        
        this.toggleBookmark(btn.closest('.welfare-card'));
    }

    handleWelfareCardClick(event) {
        if (!event.target.closest('.bookmark-card-btn')) {
            const card = event.currentTarget;
            const title = card.dataset.title || card.querySelector('h3').textContent;
            const encodedTitle = encodeURIComponent(title);
            this.goToSearchPage(`detail=${encodedTitle}`);
        }
    }

    toggleBookmark(card) {
        if (!card) return;
        
        const title = card.dataset.title || card.querySelector('h3').textContent;
        console.log('북마크 토글:', title);
        
        try {
            const bookmarks = JSON.parse(localStorage.getItem('welfare_bookmarks') || '[]');
            const index = bookmarks.indexOf(title);
            
            if (index > -1) {
                bookmarks.splice(index, 1);
            } else {
                bookmarks.push(title);
            }
            
            localStorage.setItem('welfare_bookmarks', JSON.stringify(bookmarks));
        } catch (error) {
            console.error('북마크 저장 실패:', error);
        }
    }

    // ========== 진단 테스트 관련 메서드 ==========
    // 기존 showDiagnosisPage() 메서드를 다음과 같이 수정
showDiagnosisPage() {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('map-page').classList.add('hidden');
    document.getElementById('diagnosis-page').classList.remove('hidden');
    
    // 애니메이션 시퀀스 시작
    this.startAnimationSequence();
    
    this.currentPage = 'diagnosis';
    this.updateNavigation();
    
    // 스크롤을 맨 위로
    document.getElementById('diagnosis-page').scrollTop = 0;
}

// 새로 추가할 메서드들
startAnimationSequence() {
    // 애니메이션 컨테이너 표시
    document.getElementById('animation-container').classList.add('active');
    
    // 모든 진단 그룹 숨기기
    document.querySelectorAll('.diagnosis-group').forEach(group => {
        group.classList.remove('active');
    });
    
    // 첫 번째 애니메이션 시작
    this.showFirstAnimation();
}

showFirstAnimation() {
    // 모든 애니메이션 콘텐츠 숨기기
    document.querySelectorAll('.animation-content').forEach(content => {
        content.classList.remove('active', 'fade-in-up', 'fade-out-down');
    });
    
    // 첫 번째 콘텐츠 표시
    setTimeout(() => {
        document.getElementById('animation-content-1').classList.add('active');
    }, 100);
    
    // 이벤트 리스너 설정
    this.setupAnimationEvents();
    
    // 4초 후 자동으로 두 번째 애니메이션으로 전환
    setTimeout(() => {
        this.showSecondAnimation();
    }, 2000);
}

showSecondAnimation() {
    // 첫 번째 콘텐츠 페이드아웃
    const firstContent = document.getElementById('animation-content-1');
    const secondContent = document.getElementById('animation-content-2');
    
    firstContent.classList.remove('active');
    
    // 0.6초 후 두 번째 콘텐츠 페이드인
    setTimeout(() => {
        secondContent.classList.add('active');
        
        // 4초 후 자동으로 테스트 시작
        setTimeout(() => {
            this.startDiagnosisTest();
        }, 2000);
    }, 600);
}

startDiagnosisTest() {
    // 애니메이션 컨테이너 페이드아웃
    document.getElementById('animation-container').classList.remove('active');
    
    // 0.5초 후 테스트 시작
    setTimeout(() => {
        this.resetTest();
        this.showTestSection();
    }, 500);
}

setupAnimationEvents() {
    // 닫기 버튼
    const closeBtn = document.getElementById('animation-close');
    if (closeBtn) {
        closeBtn.onclick = () => this.showMainPage();
    }
}
    resetTest() {
        this.currentQuestion = 0;
        this.answers = [];
        this.totalScore = 0;
        this.renderQuestion();
        this.updateProgress();
        this.updateNavigationButtons();
    }

    showTestSection() {
        // 모든 진단 그룹 숨기기
        document.querySelectorAll('.diagnosis-group').forEach(group => {
            group.classList.remove('active');
        });
        
        // 테스트 섹션 보이기
        const testSection = document.getElementById('diagnosis-test');
        if (testSection) {
            testSection.classList.add('active');
            testSection.style.display = 'block';
        }
        
        // 결과 그룹들 숨기기
        ['diagnosis-group-1', 'diagnosis-group-2', 'diagnosis-group-3'].forEach(id => {
            const group = document.getElementById(id);
            if (group) {
                group.style.display = 'none';
            }
        });
        
        // 첫 번째 질문 렌더링
        this.renderQuestion();
    }

    renderQuestion() {
        const container = document.getElementById('question-container');
        const question = questions[this.currentQuestion];
        
        if (!question || !container) return;

        container.innerHTML = `
            <div class="question">
                <h3>${question.question}</h3>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <div class="option" data-value="${option.value}">
                            <input type="radio" 
                                   id="option-${index}" 
                                   name="question-${this.currentQuestion}" 
                                   value="${option.value}"
                                   ${this.answers[this.currentQuestion] === option.value ? 'checked' : ''}>
                            <label for="option-${index}">${option.text}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // 옵션 클릭 이벤트 추가
        container.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => {
                const value = parseInt(e.currentTarget.dataset.value);
                this.selectAnswer(value);
            });
        });

        // 라디오 버튼 이벤트
        container.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                this.selectAnswer(value);
            });
        });
    }

    selectAnswer(value) {
        this.answers[this.currentQuestion] = value;
        
        // 선택된 옵션 표시
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[data-value="${value}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // 다음 버튼 활성화
        this.updateNavigationButtons();
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const progress = ((this.currentQuestion + 1) / questions.length) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }
        
        if (nextBtn) {
            const hasAnswer = this.answers[this.currentQuestion] !== undefined;
            nextBtn.disabled = !hasAnswer;
            
            if (this.currentQuestion === questions.length - 1) {
                nextBtn.textContent = '결과 보기';
            } else {
                nextBtn.textContent = '다음';
            }
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    nextQuestion() {
        if (this.currentQuestion < questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        } else {
            this.completeTest();
        }
    }

    completeTest() {
        this.totalScore = this.answers.reduce((sum, answer) => sum + (answer || 0), 0);
        this.showResult(this.totalScore);
    }

    showResult(score) {
        // 테스트 섹션 숨기기
        const testSection = document.getElementById('diagnosis-test');
        if (testSection) {
            testSection.classList.remove('active');
            testSection.style.display = 'none';
        }

        // 모든 결과 그룹 숨기기
        document.querySelectorAll('.diagnosis-group').forEach(group => {
            group.classList.remove('active');
            group.style.display = 'none';
        });

        let resultGroup;
        let scoreElement;

        if (score <= 9) {
            resultGroup = document.getElementById('diagnosis-group-1');
            scoreElement = document.getElementById('score-1');
        } else if (score <= 12) {
            resultGroup = document.getElementById('diagnosis-group-2');
            scoreElement = document.getElementById('score-2');
        } else {
            resultGroup = document.getElementById('diagnosis-group-3');
            scoreElement = document.getElementById('score-3');
        }

        // 점수 업데이트
        if (scoreElement) {
            scoreElement.textContent = `${score}점`;
        }

        // 해당 결과 그룹 표시
        if (resultGroup) {
            resultGroup.classList.add('active');
            resultGroup.style.display = 'block';
        }
        
        // 스크롤을 맨 위로
        document.getElementById('diagnosis-page').scrollTop = 0;
    }

    // ========== 페이지 전환 메서드 ==========
    
    showMainPage() {
        document.getElementById('main-page').classList.remove('hidden');
        document.getElementById('map-page').classList.add('hidden');
        document.getElementById('diagnosis-page').classList.add('hidden');
        this.currentPage = 'main';
        this.updateNavigation();
        
        // 메인 페이지로 돌아올 때 맨 위로 스크롤
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }

    showMapPage() {
        document.getElementById('main-page').classList.add('hidden');
        document.getElementById('map-page').classList.remove('hidden');
        document.getElementById('diagnosis-page').classList.add('hidden');
        this.currentPage = 'map';
        this.updateNavigation();
        this.updateCenterList();
        
        // 지도 리사이즈
        if (this.map) {
            setTimeout(() => this.map.resize(), 100);
        }
    }

    updateNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        if (this.currentPage === 'main') {
            const homeNav = document.querySelector('.nav-item');
            if (homeNav) homeNav.classList.add('active');
        } else if (this.currentPage === 'map') {
            const mapNav = document.getElementById('nav-map');
            if (mapNav) mapNav.classList.add('active');
        } else if (this.currentPage === 'diagnosis') {
            const diagnosisNav = document.getElementById('nav-diagnosis');
            if (diagnosisNav) diagnosisNav.classList.add('active');
        }
    }

    // ========== 지도 관련 메서드 ==========
    
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

    initializeMap() {
        if (this.mapboxToken && this.mapboxToken !== 'YOUR_MAPBOX_TOKEN_HERE') {
            this.loadMapbox();
        } else {
            this.showMapPlaceholder();
        }
    }

    loadMapbox() {
        try {
            if (typeof mapboxgl !== 'undefined') {
                mapboxgl.accessToken = this.mapboxToken;
                
                this.map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [127.7669, 35.9078],
                    zoom: 7,
                    minZoom: 6,
                    maxZoom: 18,
                    maxBounds: [
                        [124.5, 33.0],
                        [132.0, 38.9]
                    ]
                });

                this.map.on('load', () => {
                    this.addCenterMarkers();
                });
            } else {
                this.showMapPlaceholder();
            }
        } catch (error) {
            console.error('지도 로드 실패:', error);
            this.showMapPlaceholder();
        }
    }

    showMapPlaceholder() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-placeholder">
                    <div class="map-placeholder-icon">🗺️</div>
                    <h3>지도 준비 중</h3>
                    <p>Mapbox API 키 설정 후 실제 지도가 표시됩니다</p>
                </div>
            `;
        }
    }

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

    // ========== 위치 관련 메서드 (지도 페이지용) ==========
    
    async requestLocation() {
        if (!navigator.geolocation) {
            alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
            return;
        }

        try {
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

            this.calculateDistances();
            this.updateCenterList();
            
            if (this.map) {
                this.addUserMarker(this.userLocation);
            }

        } catch (error) {
            this.handleLocationError(error);
        }
    }

    showLocationLoading() {
        const btn = document.getElementById('location-btn');
        if (btn) {
            btn.innerHTML = '⏳';
        }
    }

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
        
        const btn = document.getElementById('location-btn');
        if (btn) {
            btn.innerHTML = '📍';
        }
    }

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

        this.centers.sort((a, b) => a.distance - b.distance);
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    updateCenterList() {
        const centerList = document.getElementById('center-list');
        const centerCount = document.getElementById('center-count');
        
        if (centerCount) {
            centerCount.textContent = this.centers.length;
        }
        
        if (centerList) {
            centerList.innerHTML = this.centers.map(center => this.createCenterCard(center)).join('');
            
            centerList.querySelectorAll('.center-card').forEach((card, index) => {
                card.addEventListener('click', () => this.selectCenter(this.centers[index]));
            });
        }
    }

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

    selectCenter(center) {
        if (this.map) {
            this.map.flyTo({
                center: [center.lng, center.lat],
                zoom: 16
            });
        }
    }

    openDirections(lat, lng) {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(googleMapsUrl, '_blank');
    }

    addUserMarker(location) {
        if (!this.map) return;

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

        this.map.flyTo({
            center: [location.lng, location.lat],
            zoom: 14
        });
    }

    // ========== 기타 메서드 ==========
    
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

    setupImageErrorHandling() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', (e) => {
                console.warn('이미지 로드 실패:', e.target.src);
                
                if (e.target.closest('.heart-icon')) {
                    e.target.outerHTML = '<span style="font-size: 80px;">❤️</span>';
                } else if (e.target.closest('.document-icon')) {
                    e.target.outerHTML = '<span style="font-size: 40px;">📄</span>';
                } else if (e.target.classList.contains('nav-icon')) {
                    const iconMap = {
                        'home.svg': '🏠',
                        'map.svg': '🗺️',
                        'diagnosis.svg': '📝',
                        'profile.svg': '👤'
                    };
                    const fileName = e.target.src.split('/').pop();
                    e.target.outerHTML = `<span class="nav-icon">${iconMap[fileName] || '🔸'}</span>`;
                }
            });
            
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    }
}

// 전역 함수들 (HTML에서 호출되는 함수들)
function showMainPage() {
    if (window.app) {
        window.app.showMainPage();
    }
}

function restartTest() {
    if (window.app) {
        window.app.resetTest();
        window.app.showTestSection();
    }
}

// HTML에서 onclick으로 호출되는 함수들
window.showMainPage = showMainPage;
window.restartTest = restartTest;

// DOM 로드 완료 후 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('통합 앱 초기화 시작...');
        window.app = new MentalHealthApp();
        console.log('통합 앱 초기화 완료');
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

// 추가 이벤트 리스너 (북마크, 필터 등)
document.addEventListener('click', (e) => {
    // 북마크 버튼 클릭 처리 (동적 생성된 요소용)
    if (e.target.classList.contains('bookmark-card-btn') || e.target.closest('.bookmark-card-btn')) {
        e.stopPropagation();
        const btn = e.target.closest('.bookmark-card-btn') || e.target;
        
        if (btn.textContent.includes('📚') || btn.innerHTML.includes('stroke')) {
            btn.innerHTML = '❤️';
            btn.style.color = '#FF6B6B';
        } else {
            btn.innerHTML = '📚';
            btn.style.color = '';
        }
    }
    
    // 필터 버튼 클릭 처리 (동적 생성된 요소용)
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
    }

    // 테스트 다시 하기 버튼 처리 (onclick 속성 대신)
    if (e.target.classList.contains('action-btn') && e.target.textContent.includes('테스트 다시 하기')) {
        e.preventDefault();
        e.stopPropagation();
        if (window.app) {
            window.app.resetTest();
            window.app.showTestSection();
        }
    }

    // 닫기 버튼 처리 (onclick 속성 대신)
    if (e.target.classList.contains('close-btn') && e.target.textContent.includes('×')) {
        e.preventDefault();
        e.stopPropagation();
        if (window.app) {
            window.app.showMainPage();
        }
    }
});

// 키보드 네비게이션 지원
document.addEventListener('keydown', (e) => {
    if (window.app && window.app.currentPage === 'diagnosis') {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            window.app.previousQuestion();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (window.app.answers[window.app.currentQuestion] !== undefined) {
                window.app.nextQuestion();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            window.app.showMainPage();
        }
    }
});

// 브라우저 뒤로가기 버튼 처리
window.addEventListener('popstate', (e) => {
    if (window.app) {
        window.app.showMainPage();
    }
});