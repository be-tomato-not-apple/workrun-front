// 검색 앱 클래스
class SearchApp {
    constructor() {
        this.searchQuery = '';
        this.selectedFamilyFilter = '';
        this.selectedInterestFilter = '';
        this.currentSort = 'relevance';
        this.searchResults = [];
        this.bookmarks = this.loadBookmarks();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.displayResults();
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

        // 가구상황 드롭다운
        const categorySelect = document.getElementById('category-select');
        categorySelect.addEventListener('change', (e) => {
            this.selectedFamilyFilter = e.target.value;
            this.performSearch();
        });

        // 관심주제 드롭다운
        const interestSelect = document.getElementById('interest-select');
        interestSelect.addEventListener('change', (e) => {
            this.selectedInterestFilter = e.target.value;
            this.performSearch();
        });

        // 정렬
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortAndDisplayResults();
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

    // 카테고리 변경
    handleCategoryChange(e) {
        const categoryTabs = document.querySelectorAll('.category-tab');
        const filterGroups = document.querySelectorAll('.filter-group');
        
        // 탭 활성화
        categoryTabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        
        // 필터 그룹 표시
        filterGroups.forEach(group => group.classList.remove('active'));
        const targetCategory = e.target.dataset.category;
        document.getElementById(`${targetCategory}-filters`).classList.add('active');
        
        this.selectedCategory = targetCategory;
        this.activeFilters = []; // 카테고리 변경 시 필터 초기화
        this.updateFilterChips();
        this.performSearch();
    }

    // 필터 클릭
    handleFilterClick(e) {
        const filter = e.target.dataset.filter;
        const isActive = e.target.classList.contains('active');
        
        if (isActive) {
            // 필터 제거
            this.activeFilters = this.activeFilters.filter(f => f !== filter);
            e.target.classList.remove('active');
        } else {
            // 필터 추가
            this.activeFilters.push(filter);
            e.target.classList.add('active');
        }
        
        this.performSearch();
    }

    // 필터 칩 업데이트
    updateFilterChips() {
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
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
        if (this.selectedFilter) {
            results = results.filter(item => 
                item.filters.includes(this.selectedFilter)
            );
        }
        
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
        
        if (results.length === 0) {
            resultsList.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }
        
        noResults.classList.add('hidden');
        resultsList.innerHTML = results.map(item => this.createResultCard(item)).join('');
        
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
            <div class="result-card" data-id="${item.id}">
                <div class="result-card-header">
                    <div class="result-info">
                        <h3 class="result-title">${this.highlightSearchTerm(item.title)}</h3>
                        <p class="result-organization">${item.organization}</p>
                        <div class="result-tags">
                            ${item.tags.map(tag => `
                                <span class="result-tag ${this.isFilterActive(item.filters) ? 'highlight' : ''}">${tag}</span>
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
    isFilterActive(itemFilters) {
        return (this.selectedFamilyFilter && itemFilters.includes(this.selectedFamilyFilter)) ||
               (this.selectedInterestFilter && itemFilters.includes(this.selectedInterestFilter));
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
        } else if (this.selectedFilter) {
            // 선택된 필터의 라벨 찾기
            const filterLabel = this.filterOptions[this.selectedCategory]
                .find(option => option.value === this.selectedFilter)?.label || '';
            document.getElementById('results-title').textContent = `${filterLabel} 복지정책`;
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
                filters: ["disability", "low-income", "physical-health", "life-support"],
                views: 1250,
                createdAt: "2024-01-15",
                deadline: "2024-03-31"
            },
            {
                id: 2,
                title: "한부모가족 자녀양육비 지원",
                organization: "여성가족부",
                tags: ["한부모", "양육", "생활지원"],
                filters: ["single-parent", "life-support"],
                views: 2150,
                createdAt: "2024-01-20",
                deadline: null
            },
            {
                id: 3,
                title: "다문화가족 정착지원 프로그램",
                organization: "법무부",
                tags: ["다문화", "교육", "정착지원"],
                filters: ["multicultural", "education"],
                views: 890,
                createdAt: "2024-01-18",
                deadline: "2024-04-15"
            },
            {
                id: 4,
                title: "임신·출산 의료비 지원",
                organization: "보건복지부",
                tags: ["임신", "출산", "의료비", "신체건강"],
                filters: ["pregnancy", "physical-health"],
                views: 3200,
                createdAt: "2024-01-22",
                deadline: null
            },
            {
                id: 5,
                title: "정신건강 상담 및 치료비 지원",
                organization: "국민건강보험공단",
                tags: ["정신건강", "상담", "치료", "의료비"],
                filters: ["mental-health"],
                views: 1890,
                createdAt: "2024-01-25",
                deadline: "2024-02-28"
            },
            {
                id: 6,
                title: "저소득층 주거급여",
                organization: "국토교통부",
                tags: ["저소득", "주거", "생활지원"],
                filters: ["low-income", "housing", "life-support"],
                views: 4200,
                createdAt: "2024-01-12",
                deadline: null
            },
            {
                id: 7,
                title: "청년 내일채움공제",
                organization: "고용노동부",
                tags: ["청년", "일자리", "취업"],
                filters: ["job"],
                views: 2800,
                createdAt: "2024-01-28",
                deadline: "2024-03-15"
            },
            {
                id: 8,
                title: "문화누리카드",
                organization: "문화체육관광부",
                tags: ["저소득", "문화", "여가", "복지카드"],
                filters: ["low-income", "culture"],
                views: 5100,
                createdAt: "2024-01-10",
                deadline: null
            },
            {
                id: 9,
                title: "서민금융진흥원 햇살론",
                organization: "서민금융진흥원",
                tags: ["서민금융", "대출", "금융지원"],
                filters: ["finance"],
                views: 1650,
                createdAt: "2024-01-30",
                deadline: null
            },
            {
                id: 10,
                title: "산후우울증 전문상담 지원",
                organization: "보건복지부",
                tags: ["산후우울", "정신건강", "상담", "여성"],
                filters: ["mental-health", "pregnancy"],
                views: 920,
                createdAt: "2024-02-01",
                deadline: "2024-02-29"
            },
            {
                id: 11,
                title: "장애인 활동지원서비스",
                organization: "보건복지부",
                tags: ["장애인", "생활지원", "돌봄"],
                filters: ["disability", "life-support"],
                views: 1420,
                createdAt: "2024-01-16",
                deadline: null
            },
            {
                id: 12,
                title: "다문화가족 자녀 언어발달 지원",
                organization: "여성가족부",
                tags: ["다문화", "아동", "교육", "언어"],
                filters: ["multicultural", "education"],
                views: 760,
                createdAt: "2024-01-24",
                deadline: "2024-03-30"
            },
            {
                id: 13,
                title: "신혼부부 전세자금 대출",
                organization: "주택도시기금",
                tags: ["신혼부부", "주거", "대출", "서민금융"],
                filters: ["housing", "finance"],
                views: 3800,
                createdAt: "2024-01-14",
                deadline: null
            },
            {
                id: 14,
                title: "취업성공패키지",
                organization: "고용노동부",
                tags: ["취업", "일자리", "교육", "훈련"],
                filters: ["job", "education"],
                views: 2400,
                createdAt: "2024-01-26",
                deadline: "2024-04-30"
            },
            {
                id: 15,
                title: "아이돌봄서비스",
                organization: "여성가족부",
                tags: ["육아", "돌봄", "생활지원", "아동"],
                filters: ["life-support"],
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
    const category = urlParams.get('category');
    const filters = urlParams.get('filters');
    
    if (query) {
        document.getElementById('search-input').value = query;
        window.searchApp.searchQuery = query;
        window.searchApp.performSearch();
    }
    
    if (category) {
        // 카테고리 설정
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });
        window.searchApp.selectedCategory = category;
    }
    
    if (filters) {
        // 필터 설정
        const filterArray = filters.split(',');
        filterArray.forEach(filter => {
            const filterChip = document.querySelector(`[data-filter="${filter}"]`);
            if (filterChip) {
                filterChip.classList.add('active');
                window.searchApp.activeFilters.push(filter);
            }
        });
        window.searchApp.performSearch();
    }
});