// 필터 데이터
const filterData = {
    category: {
        title: '관심주제',
        options: [
            { value: '신체건강', label: '신체건강' },
            { value: '생활지원', label: '생활지원' },
            { value: '서민금융', label: '서민금융' },
            { value: '임신/출산', label: '임신/출산' },
            { value: '정신건강', label: '정신건강' },
            { value: '교육', label: '교육' },
            { value: '문화/여가', label: '문화/여가' },
            { value: '일자리', label: '일자리' },
            { value: '주거', label: '주거' },
            { value: '기타', label: '기타' }
        ]
    },
    region: {
        title: '가구 상황',
        options: [
            { value: '장애인', label: '장애인' },
            { value: '저소득', label: '저소득' },
            { value: '다문화/탈북민', label: '다문화/탈북민' },
            { value: '한부모/조손', label: '한부모/조손' },
            { value: '기타', label: '기타' }
        ]
    }
};

// 검색 앱 클래스
class SearchApp {
    constructor() {
        this.searchQuery = '';
        this.selectedFilters = {
            category: [], // 관심주제
            region: []    // 가구상황
        };
        this.currentSort = 'relevance';
        this.searchResults = [];
        this.bookmarks = this.loadBookmarks();
        this.currentFilterType = '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.displayResults();
        this.updateSelectedFiltersDisplay();
        this.updateFilterButtonStates();
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 뒤로가기 - 메인 페이지의 welfare-section으로 이동
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.href = 'index.html#welfare-section';
        });

        // 검색 입력
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const clearBtn = document.getElementById('clear-btn');

        searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        searchBtn.addEventListener('click', () => this.performSearch());
        clearBtn.addEventListener('click', () => this.clearSearch());

        // 필터 버튼
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilterType = btn.dataset.filter;
                this.openModal(this.currentFilterType);
            });
        });

        // 모달 이벤트
        this.setupModalEvents();

        // 정렬
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortAndDisplayResults();
        });
    }

    // 모달 이벤트 설정
    setupModalEvents() {
        const modal = document.getElementById('filterModal');
        const modalClose = document.getElementById('modalClose');
        const modalReset = document.getElementById('modalReset');
        const modalApply = document.getElementById('modalApply');

        // 모달 닫기
        modalClose.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // 초기화 버튼
        modalReset.addEventListener('click', () => {
            this.selectedFilters[this.currentFilterType] = [];
            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(button => {
                button.classList.remove('selected');
            });
        });

        // 적용 버튼
        modalApply.addEventListener('click', () => {
            this.updateSelectedFiltersDisplay();
            this.updateFilterButtonStates();
            this.performSearch();
            this.closeModal();
        });
    }

    // 모달 열기
    openModal(filterType) {
        const modal = document.getElementById('filterModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        const data = filterData[filterType];
        modalTitle.textContent = data.title;
        
        // 모달 내용 생성
        modalBody.innerHTML = '';
        
        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'options-grid';
        
        data.options.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.dataset.value = option.value;
            
            const isSelected = this.selectedFilters[filterType].includes(option.value);
            if (isSelected) {
                optionBtn.classList.add('selected');
            }
            
            optionBtn.innerHTML = `<span>${option.label}</span>`;
            
            optionBtn.addEventListener('click', () => {
                this.toggleOption(filterType, option.value, optionBtn);
            });
            
            optionsGrid.appendChild(optionBtn);
        });
        
        modalBody.appendChild(optionsGrid);
        modal.classList.add('show');
    }

    // 옵션 선택/해제
    toggleOption(filterType, value, button) {
        const index = this.selectedFilters[filterType].indexOf(value);
        
        if (index > -1) {
            this.selectedFilters[filterType].splice(index, 1);
            button.classList.remove('selected');
        } else {
            this.selectedFilters[filterType].push(value);
            button.classList.add('selected');
        }
    }

    // 모달 닫기
    closeModal() {
        const modal = document.getElementById('filterModal');
        modal.classList.add('closing');
        
        setTimeout(() => {
            modal.classList.remove('show', 'closing');
        }, 300);
    }

    // 선택된 필터 표시 업데이트
    updateSelectedFiltersDisplay() {
        const selectedFiltersContainer = document.getElementById('selectedFilters');
        if (!selectedFiltersContainer) {
            // selectedFilters 컨테이너가 없으면 생성
            const filterSection = document.querySelector('.filter-section');
            if (filterSection) {
                const container = document.createElement('div');
                container.id = 'selectedFilters';
                container.className = 'selected-filters';
                filterSection.appendChild(container);
            }
            return;
        }
        
        // 기존 태그들에 페이드아웃 효과
        const existingTags = selectedFiltersContainer.querySelectorAll('.filter-tag');
        existingTags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.05}s`;
            tag.classList.add('fade-out');
        });
        
        setTimeout(() => {
            selectedFiltersContainer.innerHTML = '';
            
            let tagIndex = 0;
            Object.keys(this.selectedFilters).forEach(filterType => {
                this.selectedFilters[filterType].forEach(value => {
                    const option = filterData[filterType].options.find(opt => opt.value === value);
                    if (option) {
                    const tag = document.createElement('div');
                    tag.className = 'filter-tag scale-in';
                    tag.style.animationDelay = `${tagIndex * 0.1}s`;
                    tag.innerHTML = `
                        ${option.label}
                        <span class="remove" data-type="${filterType}" data-value="${value}">×</span>
                    `;
                    selectedFiltersContainer.appendChild(tag);
                    tagIndex++;
                    }
                });
            });

            // 필터 태그 제거 이벤트
            selectedFiltersContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove')) {
                    const filterType = e.target.dataset.type;
                    const value = e.target.dataset.value;
                    
                    // 태그 제거 애니메이션
                    const tagElement = e.target.parentElement;
                    tagElement.classList.add('fade-out');
                    
                    setTimeout(() => {
                        const index = this.selectedFilters[filterType].indexOf(value);
                        if (index > -1) {
                            this.selectedFilters[filterType].splice(index, 1);
                            this.updateSelectedFiltersDisplay();
                            this.updateFilterButtonStates();
                            this.performSearch();
                        }
                    }, 200);
                }
            });
        }, 200);
    }

    // 필터 버튼 상태 업데이트
    updateFilterButtonStates() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            const filterType = btn.dataset.filter;
            const selectedCount = this.selectedFilters[filterType] ? this.selectedFilters[filterType].length : 0;
            
            if (selectedCount > 0) {
                btn.classList.add('active');
                
                // 버튼 텍스트 업데이트
                const selectedOptions = this.selectedFilters[filterType];
                const firstOption = filterData[filterType].options.find(opt => opt.value === selectedOptions[0]);
                
                let displayText = '';
                if (selectedCount === 1) {
                    displayText = firstOption.label;
                } else {
                    displayText = `${firstOption.label} 외 <span class="count">${selectedCount - 1}</span>`;
                }
                
                btn.innerHTML = `
                    <div class="filter-btn-content">
                        <span class="filter-btn-text">${displayText}</span>
                        <span class="filter-btn-arrow">▼</span>
                    </div>
                `;
            } else {
                btn.classList.remove('active');
                
                // 원래 텍스트로 복원
                const originalText = filterData[filterType].title;
                btn.innerHTML = `
                    <div class="filter-btn-content">
                        <span class="filter-btn-text">${originalText}</span>
                        <span class="filter-btn-arrow">▼</span>
                    </div>
                `;
            }
        });
    }

    // 검색 입력 처리
    handleSearchInput(e) {
        const value = e.target.value;
        const clearBtn = document.getElementById('clear-btn');
        
        if (value.length > 0) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }

        // 실시간 검색 (디바운싱 적용)
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchQuery = value;
            this.performSearch();
        }, 300);
    }

    // 검색 실행
    performSearch() {
        const loading = document.getElementById('loading');
        const resultsList = document.getElementById('results-list');
        
        // 로딩 표시
        loading.classList.remove('hidden');
        resultsList.innerHTML = '';

        // 검색 시뮬레이션
        setTimeout(() => {
            this.filterResults();
            this.sortAndDisplayResults();
            loading.classList.add('hidden');
        }, 500);
    }

    // 검색 지우기
    clearSearch() {
        document.getElementById('search-input').value = '';
        document.getElementById('clear-btn').classList.add('hidden');
        this.searchQuery = '';
        this.performSearch();
    }

    // 결과 필터링
    filterResults() {
        let results = [...this.sampleData];
        
        // 검색어 필터링
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            results = results.filter(item => 
                item.title.toLowerCase().includes(query) ||
                item.organization.toLowerCase().includes(query) ||
                item.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        // 선택된 필터 적용
        Object.keys(this.selectedFilters).forEach(filterType => {
            if (this.selectedFilters[filterType].length > 0) {
                results = results.filter(item => 
                    this.selectedFilters[filterType].some(filter => 
                        item.tags.includes(filter)
                    )
                );
            }
        });
        
        this.searchResults = results;
        this.updateResultsCount();
    }

    // 결과 정렬 및 표시
    sortAndDisplayResults() {
        let sortedResults = [...this.searchResults];
        
        switch (this.currentSort) {
            case 'newest':
                sortedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                sortedResults.sort((a, b) => b.views - a.views);
                break;
            case 'deadline':
                sortedResults.sort((a, b) => {
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                });
                break;
            default: // relevance
                // 검색어 관련도순 (간단한 구현)
                if (this.searchQuery.trim()) {
                    sortedResults.sort((a, b) => {
                        const aScore = this.calculateRelevanceScore(a, this.searchQuery);
                        const bScore = this.calculateRelevanceScore(b, this.searchQuery);
                        return bScore - aScore;
                    });
                }
        }
        
        this.displayResults(sortedResults);
    }

    // 관련도 점수 계산
    calculateRelevanceScore(item, query) {
        const lowerQuery = query.toLowerCase();
        let score = 0;
        
        if (item.title.toLowerCase().includes(lowerQuery)) score += 10;
        if (item.organization.toLowerCase().includes(lowerQuery)) score += 5;
        item.tags.forEach(tag => {
            if (tag.toLowerCase().includes(lowerQuery)) score += 3;
        });
        
        return score;
    }

    // 결과 표시
    displayResults(results = this.searchResults) {
        const resultsList = document.getElementById('results-list');
        const noResults = document.getElementById('no-results');
        
        // 기존 결과에 페이드아웃 효과
        if (resultsList.children.length > 0) {
            resultsList.style.opacity = '0';
            setTimeout(() => {
                this.renderResults(results, resultsList, noResults);
            }, 150);
        } else {
            this.renderResults(results, resultsList, noResults);
        }
    }

    // 실제 결과 렌더링
    renderResults(results, resultsList, noResults) {
        if (results.length === 0) {
            resultsList.innerHTML = '';
            resultsList.style.opacity = '1';
            noResults.classList.remove('hidden');
            noResults.classList.add('fade-in-up');
            return;
        }
        
        noResults.classList.add('hidden');
        resultsList.innerHTML = results.map((item, index) => {
            const card = this.createResultCard(item);
            return `<div class="result-card staggered-animation" style="animation-delay: ${index * 0.1}s">${card}</div>`;
        }).join('');
        
        // 페이드인 효과
        resultsList.style.opacity = '1';
        resultsList.classList.add('fade-in');
        
        // 북마크 버튼 이벤트 리스너 추가
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleBookmark(e));
        });
    }

    // 결과 카드 생성
    createResultCard(item) {
        const isBookmarked = this.bookmarks.includes(item.id);
        const deadlineText = item.deadline ? 
            `마감: ${this.formatDate(item.deadline)}` : '';
        
        return `
            <div class="result-card-content" data-id="${item.id}">
                <div class="result-card-header">
                    <div class="result-info">
                        <h3 class="result-title">${this.highlightSearchTerm(item.title)}</h3>
                        <p class="result-organization">${item.organization}</p>
                        <div class="result-tags">
                            ${item.tags.map(tag => `
                                <span class="result-tag ${this.isFilterActive(item.tags) ? 'highlight' : ''}">${tag}</span>
                            `).join('')}
                        </div>
                        <div class="result-meta">
                            <span>조회수 ${item.views.toLocaleString()}</span>
                            ${deadlineText ? `<span class="result-deadline">${deadlineText}</span>` : ''}
                        </div>
                    </div>
                    <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${item.id}">
                        ${isBookmarked ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
    }

    // 필터가 활성화되어 있는지 확인
    isFilterActive(itemTags) {
        return Object.keys(this.selectedFilters).some(filterType => 
            this.selectedFilters[filterType].some(filter => 
                itemTags.includes(filter)
            )
        );
    }

    // 검색어 하이라이트
    highlightSearchTerm(text) {
        if (!this.searchQuery.trim()) return text;
        
        const regex = new RegExp(`(${this.searchQuery})`, 'gi');
        return text.replace(regex, '<mark style="background: #FFE5E5; color: #FF6B6B;">$1</mark>');
    }

    // 날짜 포맷
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return '마감됨';
        if (diffDays === 0) return '오늘 마감';
        if (diffDays === 1) return '내일 마감';
        if (diffDays <= 7) return `${diffDays}일 후 마감`;
        
        return `${date.getMonth() + 1}/${date.getDate()} 마감`;
    }

    // 북마크 처리
    handleBookmark(e) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const itemId = parseInt(btn.dataset.id);
        const isBookmarked = btn.classList.contains('active');
        
        if (isBookmarked) {
            // 북마크 제거
            this.bookmarks = this.bookmarks.filter(id => id !== itemId);
            btn.classList.remove('active');
            btn.textContent = '🤍';
        } else {
            // 북마크 추가
            this.bookmarks.push(itemId);
            btn.classList.add('active');
            btn.textContent = '❤️';
        }
        
        this.saveBookmarks();
    }

    // 결과 개수 업데이트
    updateResultsCount() {
        const count = this.searchResults.length;
        document.getElementById('results-count').textContent = `(${count}개)`;
        
        // 검색어가 있으면 제목 변경
        if (this.searchQuery.trim()) {
            document.getElementById('results-title').textContent = `"${this.searchQuery}" 검색결과`;
        } else {
            document.getElementById('results-title').textContent = '추천 복지정책';
        }
    }

    // 북마크 로드
    loadBookmarks() {
        try {
            const bookmarks = localStorage.getItem('welfare_bookmarks');
            return bookmarks ? JSON.parse(bookmarks) : [];
        } catch (error) {
            console.error('북마크 로드 실패:', error);
            return [];
        }
    }

    // 북마크 저장
    saveBookmarks() {
        try {
            localStorage.setItem('welfare_bookmarks', JSON.stringify(this.bookmarks));
        } catch (error) {
            console.error('북마크 저장 실패:', error);
        }
    }

    // 샘플 데이터 로드
    loadSampleData() {
        this.sampleData = [
            {
                id: 1,
                title: "심장질환 및 희귀난치성질환 아동청소년 지원사업",
                organization: "사회복지법인 밀알복지재단",
                tags: ["장애인", "저소득", "신체건강", "생활지원"],
                views: 1250,
                createdAt: "2024-01-15",
                deadline: "2024-03-31"
            },
            {
                id: 2,
                title: "한부모가족 자녀양육비 지원",
                organization: "여성가족부",
                tags: ["한부모/조손", "양육", "생활지원"],
                views: 2150,
                createdAt: "2024-01-20",
                deadline: null
            },
            {
                id: 3,
                title: "다문화가족 정착지원 프로그램",
                organization: "법무부",
                tags: ["다문화/탈북민", "교육", "정착지원"],
                views: 890,
                createdAt: "2024-01-18",
                deadline: "2024-04-15"
            },
            {
                id: 4,
                title: "임신·출산 의료비 지원",
                organization: "보건복지부",
                tags: ["임신/출산", "신체건강", "의료비"],
                views: 3200,
                createdAt: "2024-01-22",
                deadline: null
            },
            {
                id: 5,
                title: "정신건강 상담 및 치료비 지원",
                organization: "국민건강보험공단",
                tags: ["정신건강", "상담", "치료", "의료비"],
                views: 1890,
                createdAt: "2024-01-25",
                deadline: "2024-02-28"
            },
            {
                id: 6,
                title: "저소득층 주거급여",
                organization: "국토교통부",
                tags: ["저소득", "주거", "생활지원"],
                views: 4200,
                createdAt: "2024-01-12",
                deadline: null
            },
            {
                id: 7,
                title: "청년 내일채움공제",
                organization: "고용노동부",
                tags: ["청년", "일자리", "취업"],
                views: 2800,
                createdAt: "2024-01-28",
                deadline: "2024-03-15"
            },
            {
                id: 8,
                title: "문화누리카드",
                organization: "문화체육관광부",
                tags: ["저소득", "문화/여가", "복지카드"],
                views: 5100,
                createdAt: "2024-01-10",
                deadline: null
            },
            {
                id: 9,
                title: "서민금융진흥원 햇살론",
                organization: "서민금융진흥원",
                tags: ["서민금융", "대출", "금융지원"],
                views: 1650,
                createdAt: "2024-01-30",
                deadline: null
            },
            {
                id: 10,
                title: "산후우울증 전문상담 지원",
                organization: "보건복지부",
                tags: ["산후우울", "정신건강", "상담", "여성"],
                views: 920,
                createdAt: "2024-02-01",
                deadline: "2024-02-29"
            },
            {
                id: 11,
                title: "장애인 활동지원서비스",
                organization: "보건복지부",
                tags: ["장애인", "생활지원", "돌봄"],
                views: 1420,
                createdAt: "2024-01-16",
                deadline: null
            },
            {
                id: 12,
                title: "다문화가족 자녀 언어발달 지원",
                organization: "여성가족부",
                tags: ["다문화/탈북민", "아동", "교육", "언어"],
                views: 760,
                createdAt: "2024-01-24",
                deadline: "2024-03-30"
            },
            {
                id: 13,
                title: "신혼부부 전세자금 대출",
                organization: "주택도시기금",
                tags: ["신혼부부", "주거", "대출", "서민금융"],
                views: 3800,
                createdAt: "2024-01-14",
                deadline: null
            },
            {
                id: 14,
                title: "취업성공패키지",
                organization: "고용노동부",
                tags: ["취업", "일자리", "교육", "훈련"],
                views: 2400,
                createdAt: "2024-01-26",
                deadline: "2024-04-30"
            },
            {
                id: 15,
                title: "아이돌봄서비스",
                organization: "여성가족부",
                tags: ["육아", "돌봄", "생활지원", "아동"],
                views: 2900,
                createdAt: "2024-01-19",
                deadline: null
            }
        ];
    }
}

// 페이지 로드 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.searchApp = new SearchApp();
});

// URL 파라미터로 검색어 받기
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        document.getElementById('search-input').value = query;
        window.searchApp.searchQuery = query;
        window.searchApp.performSearch();
    }
});