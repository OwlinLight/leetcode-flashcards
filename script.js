class SpacedRepetition {
    constructor() {
        this.intervals = {
            again: 1,
            hard: 2,
            good: 4,
            easy: 7
        };
    }

    calculateNextReview(difficulty, currentInterval = 1, easeFactor = 2.5) {
        let nextInterval;
        let newEaseFactor = easeFactor;

        switch (difficulty) {
            case 'again':
                nextInterval = this.intervals.again;
                newEaseFactor = Math.max(1.3, easeFactor - 0.2);
                break;
            case 'hard':
                nextInterval = Math.max(1, Math.round(currentInterval * this.intervals.hard * (newEaseFactor - 0.15)));
                newEaseFactor = Math.max(1.3, easeFactor - 0.15);
                break;
            case 'good':
                nextInterval = Math.round(currentInterval * newEaseFactor);
                break;
            case 'easy':
                nextInterval = Math.round(currentInterval * newEaseFactor * this.intervals.easy);
                newEaseFactor = easeFactor + 0.15;
                break;
            default:
                nextInterval = this.intervals.good;
        }

        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

        return {
            nextInterval,
            nextReviewDate,
            easeFactor: newEaseFactor
        };
    }
}

class FlashcardApp {
    constructor() {
        this.cards = this.loadCards();
        this.spacedRepetition = new SpacedRepetition();
        this.currentCard = null;
        this.filteredCards = [...this.cards];
        this.currentDate = new Date();
        
        this.initializeEventListeners();
        this.renderCards();
        this.updateCalendarStats();
        
        if (this.cards.length === 0) {
            this.loadSampleData();
        }
    }

    loadCards() {
        const saved = localStorage.getItem('leetcode-flashcards');
        if (saved) {
            const cards = JSON.parse(saved);
            return cards.map(card => ({
                ...card,
                createdAt: new Date(card.createdAt),
                nextReview: new Date(card.nextReview)
            }));
        }
        return [];
    }

    saveCards() {
        localStorage.setItem('leetcode-flashcards', JSON.stringify(this.cards));
    }

    loadSampleData() {
        const sampleCards = [
            {
                id: Date.now() + 1,
                title: "Two Sum",
                problem: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
                solution: `def twoSum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
                explanation: "Use a hash map to store numbers and their indices. For each number, check if its complement (target - current number) exists in the map.",
                difficulty: "easy",
                tags: ["array", "hash-table"],
                status: "new",
                createdAt: new Date(),
                nextReview: new Date(),
                interval: 1,
                easeFactor: 2.5,
                reviewCount: 0
            },
            {
                id: Date.now() + 2,
                title: "Valid Parentheses",
                problem: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
                solution: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack`,
                explanation: "Use a stack to track opening brackets. When encountering a closing bracket, check if it matches the most recent opening bracket.",
                difficulty: "easy",
                tags: ["string", "stack"],
                status: "new",
                createdAt: new Date(),
                nextReview: new Date(),
                interval: 1,
                easeFactor: 2.5,
                reviewCount: 0
            },
            {
                id: Date.now() + 3,
                title: "Longest Substring Without Repeating Characters",
                problem: "Given a string s, find the length of the longest substring without repeating characters.",
                solution: `def lengthOfLongestSubstring(s):
    char_map = {}
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        if s[right] in char_map and char_map[s[right]] >= left:
            left = char_map[s[right]] + 1
        
        char_map[s[right]] = right
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
                explanation: "Use sliding window technique with two pointers. Maintain a hash map to track character positions and adjust the left pointer when duplicates are found.",
                difficulty: "medium",
                tags: ["string", "sliding-window", "hash-table"],
                status: "new",
                createdAt: new Date(),
                nextReview: new Date(),
                interval: 1,
                easeFactor: 2.5,
                reviewCount: 0
            },
            {
                id: Date.now() + 4,
                title: "Merge Two Sorted Lists",
                problem: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted manner and return the head of the merged linked list.",
                solution: `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    current = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    current.next = list1 or list2
    return dummy.next`,
                explanation: "Use a dummy node to simplify the merging process. Compare values from both lists and attach the smaller one to the result.",
                difficulty: "easy",
                tags: ["linked-list", "recursion"],
                status: "new",
                createdAt: new Date(),
                nextReview: new Date(),
                interval: 1,
                easeFactor: 2.5,
                reviewCount: 0
            },
            {
                id: Date.now() + 5,
                title: "Best Time to Buy and Sell Stock",
                problem: "You are given an array prices where prices[i] is the price of a given stock on day i. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.",
                solution: `def maxProfit(prices):
    if not prices:
        return 0
    
    min_price = prices[0]
    max_profit = 0
    
    for price in prices[1:]:
        max_profit = max(max_profit, price - min_price)
        min_price = min(min_price, price)
    
    return max_profit`,
                explanation: "Track the minimum price seen so far and calculate profit for each day. Keep updating the maximum profit achievable.",
                difficulty: "easy",
                tags: ["array", "dynamic-programming"],
                status: "new",
                createdAt: new Date(),
                nextReview: new Date(),
                interval: 1,
                easeFactor: 2.5,
                reviewCount: 0
            }
        ];

        this.cards = sampleCards;
        this.filteredCards = [...this.cards];
        this.saveCards();
        this.renderCards();
        this.updateCalendarStats();
    }

    initializeEventListeners() {
        document.getElementById('calendarBtn').addEventListener('click', () => {
            this.toggleCalendar();
        });

        document.getElementById('addCardBtn').addEventListener('click', () => {
            this.showAddCardModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideStudyModal();
        });

        document.getElementById('closeAddModal').addEventListener('click', () => {
            this.hideAddCardModal();
        });

        document.getElementById('showSolution').addEventListener('click', () => {
            this.showSolution();
        });

        document.getElementById('difficultyButtons').addEventListener('click', (e) => {
            if (e.target.dataset.difficulty) {
                this.handleDifficultyResponse(e.target.dataset.difficulty);
            }
        });

        document.getElementById('addCardForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewCard();
        });

        document.getElementById('difficultyFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('statusFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('dateFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        document.getElementById('prevMonth').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.changeMonth(1);
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideStudyModal();
                this.hideAddCardModal();
            }
        });
    }

    toggleCalendar() {
        const calendar = document.getElementById('calendarContainer');
        calendar.classList.toggle('active');
        if (calendar.classList.contains('active')) {
            this.renderCalendar();
        }
    }

    renderCalendar() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        
        document.getElementById('currentMonth').textContent = 
            `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.textAlign = 'center';
            dayHeader.style.padding = '10px';
            grid.appendChild(dayHeader);
        });

        for (let i = 0; i < 42; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDay.getDate();

            if (currentDay.getMonth() !== this.currentDate.getMonth()) {
                dayElement.style.opacity = '0.3';
            }

            if (this.isSameDay(currentDay, new Date())) {
                dayElement.classList.add('today');
            }

            const cardsForDay = this.getCardsForDate(currentDay);
            if (cardsForDay.length > 0) {
                dayElement.classList.add('has-cards');
            }

            dayElement.addEventListener('click', () => {
                this.filterByDate(currentDay);
            });

            grid.appendChild(dayElement);
        }
    }

    getCardsForDate(date) {
        return this.cards.filter(card => 
            this.isSameDay(card.nextReview, date)
        );
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    updateCalendarStats() {
        const today = new Date();
        const todayCards = this.cards.filter(card => 
            this.isSameDay(card.nextReview, today) || card.nextReview < today
        ).length;

        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        const weekCards = this.cards.filter(card => 
            card.nextReview <= weekFromNow
        ).length;

        document.getElementById('todayCards').textContent = todayCards;
        document.getElementById('weekCards').textContent = weekCards;
    }

    renderCards() {
        const container = document.getElementById('waterfallGrid');
        container.innerHTML = '';

        this.filteredCards.forEach(card => {
            const cardElement = this.createCardElement(card);
            container.appendChild(cardElement);
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `flashcard ${card.difficulty}`;
        cardDiv.addEventListener('click', () => this.openCard(card));

        const isOverdue = card.nextReview < new Date();
        const dueDateText = isOverdue ? 'Overdue' : this.formatDate(card.nextReview);

        cardDiv.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${card.title}</h3>
                <span class="difficulty-badge ${card.difficulty}">${card.difficulty}</span>
            </div>
            <p class="card-problem">${card.problem}</p>
            <div class="card-meta">
                <span class="card-status ${card.status}">${card.status}</span>
                <span class="due-date ${isOverdue ? 'overdue' : ''}">${dueDateText}</span>
            </div>
            ${card.tags && card.tags.length > 0 ? `
                <div class="card-tags">
                    ${card.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        `;

        return cardDiv;
    }

    formatDate(date) {
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `${diffDays} days`;
        return date.toLocaleDateString();
    }

    openCard(card) {
        this.currentCard = card;
        document.getElementById('modalTitle').textContent = card.title;
        document.getElementById('problemText').textContent = card.problem;
        document.getElementById('solutionCode').textContent = card.solution;
        document.getElementById('solutionExplanation').textContent = card.explanation;
        
        document.getElementById('solutionSection').style.display = 'none';
        document.getElementById('showSolution').style.display = 'block';
        document.getElementById('difficultyButtons').style.display = 'none';
        
        document.getElementById('cardModal').classList.add('active');
    }

    showSolution() {
        document.getElementById('solutionSection').style.display = 'block';
        document.getElementById('showSolution').style.display = 'none';
        document.getElementById('difficultyButtons').style.display = 'flex';
    }

    handleDifficultyResponse(difficulty) {
        if (!this.currentCard) return;

        const result = this.spacedRepetition.calculateNextReview(
            difficulty,
            this.currentCard.interval,
            this.currentCard.easeFactor
        );

        this.currentCard.interval = result.nextInterval;
        this.currentCard.nextReview = result.nextReviewDate;
        this.currentCard.easeFactor = result.easeFactor;
        this.currentCard.reviewCount++;

        if (difficulty === 'easy' && this.currentCard.reviewCount >= 3) {
            this.currentCard.status = 'mastered';
        } else if (difficulty === 'again') {
            this.currentCard.status = 'learning';
        } else if (this.currentCard.reviewCount >= 1) {
            this.currentCard.status = 'review';
        }

        this.saveCards();
        this.renderCards();
        this.updateCalendarStats();
        this.hideStudyModal();
    }

    hideStudyModal() {
        document.getElementById('cardModal').classList.remove('active');
        this.currentCard = null;
    }

    showAddCardModal() {
        document.getElementById('addCardModal').classList.add('active');
    }

    hideAddCardModal() {
        document.getElementById('addCardModal').classList.remove('active');
        document.getElementById('addCardForm').reset();
    }

    addNewCard() {
        const title = document.getElementById('cardTitle').value.trim();
        const problem = document.getElementById('cardProblem').value.trim();
        const solution = document.getElementById('cardSolution').value.trim();
        const explanation = document.getElementById('cardExplanation').value.trim();
        const difficulty = document.getElementById('cardDifficulty').value;
        const tagsInput = document.getElementById('cardTags').value.trim();

        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];

        const newCard = {
            id: Date.now(),
            title,
            problem,
            solution,
            explanation,
            difficulty,
            tags,
            status: 'new',
            createdAt: new Date(),
            nextReview: new Date(),
            interval: 1,
            easeFactor: 2.5,
            reviewCount: 0
        };

        this.cards.push(newCard);
        this.saveCards();
        this.applyFilters();
        this.updateCalendarStats();
        this.hideAddCardModal();
    }

    applyFilters() {
        const difficultyFilter = document.getElementById('difficultyFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;

        this.filteredCards = this.cards.filter(card => {
            let matches = true;

            if (difficultyFilter !== 'all' && card.difficulty !== difficultyFilter) {
                matches = false;
            }

            if (statusFilter !== 'all' && card.status !== statusFilter) {
                matches = false;
            }

            if (dateFilter) {
                const filterDate = new Date(dateFilter);
                if (!this.isSameDay(card.nextReview, filterDate)) {
                    matches = false;
                }
            }

            return matches;
        });

        this.renderCards();
    }

    filterByDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        document.getElementById('dateFilter').value = dateStr;
        this.applyFilters();
        this.toggleCalendar();
    }

    clearFilters() {
        document.getElementById('difficultyFilter').value = 'all';
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('dateFilter').value = '';
        this.filteredCards = [...this.cards];
        this.renderCards();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});