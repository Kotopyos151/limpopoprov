// ==================== ОТЛАДКА ====================
console.log('Скрипт загружен');

// Массив с фоновыми изображениями для hero секции
const heroBackgrounds = [
    'images/ris1.jpg',
    'images/ris2.jpg',
    'images/ris3.jpg',
    'images/ris4.jpg'
];

console.log('Hero backgrounds:', heroBackgrounds);

// Проверка существования изображений
heroBackgrounds.forEach((bg, index) => {
    const img = new Image();
    img.onload = () => console.log(`✅ Изображение ${index + 1} загружено: ${bg}`);
    img.onerror = () => console.log(`❌ Ошибка загрузки изображения ${index + 1}: ${bg}`);
    img.src = bg;
});

// Переменная для хранения расписания
let availabilityData = {};

// Основная функция при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
    
    // Загружаем расписание из JSON
    loadAvailabilityData();
    
    // Инициализация всех компонентов
    initAnimations();
    initSmoothScroll();
    initActiveNavigation();
    initHeroSection();
    initReviews();
    initFloatingReviews();
    initDatePicker();
    initContactForm();
});

// ==================== ЗАГРУЗКА РАСПИСАНИЯ ====================
function loadAvailabilityData() {
    fetch('availability.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки расписания');
            }
            return response.json();
        })
        .then(data => {
            availabilityData = data;
            console.log('✅ Расписание загружено:', availabilityData);
        })
        .catch(error => {
            console.error('❌ Ошибка загрузки расписания:', error);
            // Если файл не найден, создаем тестовые данные
            availabilityData = {
                "2026-03-10": ["11:00 - 12:00", "15:00 - 16:00"],
                "2026-03-11": ["12:00 - 14:00", "17:00 - 19:00"],
                "2026-03-12": ["11:00 - 20:00"]
            };
            console.log('✅ Используются тестовые данные');
        });
}

// ==================== АНИМАЦИИ ====================
function initAnimations() {
    const animateElements = () => {
        const elements = document.querySelectorAll('.animate-on-load');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    };
    animateElements();
}

// ==================== НАВИГАЦИЯ ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initActiveNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        // Пропускаем логотип
        if (link.closest('.logo')) return;
        
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Убираем активный класс у логотипа
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.classList.remove('active');
    }
}

// ==================== HERO СЕКЦИЯ ====================
function initHeroSection() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    console.log('Инициализация hero секции');

    // Создаем контейнер для фонов
    const backgroundsContainer = document.createElement('div');
    backgroundsContainer.className = 'hero-backgrounds';

    // Создаем элементы для каждого фона
    heroBackgrounds.forEach((bg, index) => {
        const bgDiv = document.createElement('div');
        bgDiv.className = `hero-bg ${index === 0 ? 'active' : ''}`;
        bgDiv.style.backgroundImage = `url('${bg}')`;
        backgroundsContainer.appendChild(bgDiv);
    });

    // Сохраняем оригинальный контент
    const originalH1 = heroSection.querySelector('h1');
    const originalP = heroSection.querySelector('p');
    
    // Очищаем hero секцию
    heroSection.innerHTML = '';
    
    // Добавляем контейнер с фонами
    heroSection.appendChild(backgroundsContainer);
    
    // Создаем и добавляем контент
    const heroContent = document.createElement('div');
    heroContent.className = 'hero-content';
    
    if (originalH1 && originalP) {
        heroContent.appendChild(originalH1.cloneNode(true));
        heroContent.appendChild(originalP.cloneNode(true));
    } else {
        const h1 = document.createElement('h1');
        h1.textContent = 'Лимпопо';
        const p = document.createElement('p');
        p.textContent = 'Детский игровой центр';
        heroContent.appendChild(h1);
        heroContent.appendChild(p);
    }
    
    heroSection.appendChild(heroContent);
    
    // Добавляем навигационные точки
    addHeroNavigation(heroSection);
    
    // Добавляем индикатор прокрутки
    addScrollIndicator(heroSection);

    // Запускаем автоматическую смену фона
    startAutoBackgroundChange();

    // Добавляем эффект параллакса
    window.addEventListener('scroll', handleParallax);
    
    console.log('Hero секция инициализирована');
}

function addHeroNavigation(heroSection) {
    const bgNav = document.createElement('div');
    bgNav.className = 'bg-nav';

    heroBackgrounds.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `bg-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', () => changeBackground(index));
        bgNav.appendChild(dot);
    });

    heroSection.appendChild(bgNav);
}

function addScrollIndicator(heroSection) {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = 'Листайте вниз <i class="fas fa-chevron-down"></i>';
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });

    heroSection.appendChild(scrollIndicator);
}

function changeBackground(index) {
    const backgrounds = document.querySelectorAll('.hero-bg');
    const dots = document.querySelectorAll('.bg-dot');

    backgrounds.forEach((bg, i) => {
        bg.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function startAutoBackgroundChange() {
    let currentBgIndex = 0;
    setInterval(() => {
        currentBgIndex = (currentBgIndex + 1) % heroBackgrounds.length;
        changeBackground(currentBgIndex);
    }, 5000);
}

function handleParallax() {
    const scrollPosition = window.scrollY;
    const backgrounds = document.querySelectorAll('.hero-bg');

    backgrounds.forEach(bg => {
        bg.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    });

    const content = document.querySelector('.hero-content');
    if (content) {
        const opacity = Math.max(0, 1 - scrollPosition / 500);
        content.style.opacity = opacity;
    }
}

// ==================== ОТЗЫВЫ ====================
function initReviews() {
    const reviewForm = document.getElementById('reviewForm');
    const reviewFormElement = document.getElementById('reviewFormElement');
    const ratingStars = document.querySelectorAll('#ratingStars span');
    const ratingInput = document.getElementById('reviewRating');

    // Загрузка отзывов
    loadReviews();
    updateFloatingReviews();

    // Выбор рейтинга
    if (ratingStars.length) {
        ratingStars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                ratingInput.value = value;

                ratingStars.forEach((s, i) => {
                    if (i < value) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
            });
        });
    }

    // Отправка формы
    if (reviewFormElement) {
        reviewFormElement.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('reviewName');
            const textInput = document.getElementById('reviewText');
            
            if (!nameInput || !textInput) return;
            
            const review = {
                name: nameInput.value.trim() || 'Анонимный пользователь',
                rating: ratingInput?.value || 5,
                text: textInput.value.trim() || 'Отличный центр!',
                date: new Date().toLocaleDateString('ru-RU')
            };

            saveReview(review);
            reviewFormElement.reset();
            resetStars(ratingStars);
            loadReviews();
            updateFloatingReviews();
            
            // Показываем сообщение об успехе
            alert('Спасибо за ваш отзыв!');
        });
    }
}

function resetStars(ratingStars) {
    ratingStars.forEach(star => {
        star.classList.remove('selected');
    });
    // По умолчанию выбираем 5 звезд
    const ratingInput = document.getElementById('reviewRating');
    if (ratingInput) ratingInput.value = 5;
}

function saveReview(review) {
    let savedReviews = [];
    if (localStorage.getItem('reviews')) {
        savedReviews = JSON.parse(localStorage.getItem('reviews'));
    }
    savedReviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(savedReviews));
}

function loadReviews() {
    // Функция для загрузки отзывов - сейчас отзывы только во всплывающем окне
}

function createReviewHTML(review) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    return `
        <div class="review-item">
            <div class="review-header">
                <strong>${review.name}</strong>
                <div class="review-rating">${stars}</div>
                <span class="review-date">${review.date}</span>
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `;
}

// ==================== ВСПЛЫВАЮЩИЕ ОТЗЫВЫ ====================
function initFloatingReviews() {
    const floatingToggle = document.getElementById('floatingToggle');
    const floatingPanel = document.getElementById('floatingPanel');
    const closeFloating = document.getElementById('closeFloating');
    const floatingReviewBtn = document.getElementById('floatingReviewBtn');
    const reviewsCount = document.getElementById('reviewsCount');

    if (!floatingPanel || !floatingToggle) return;

    // Панель уже открыта по умолчанию (class="show" в HTML)

    // Обновляем счетчик отзывов
    function updateReviewsCount() {
        if (localStorage.getItem('reviews')) {
            const reviews = JSON.parse(localStorage.getItem('reviews'));
            if (reviewsCount) reviewsCount.textContent = reviews.length;
        } else {
            if (reviewsCount) reviewsCount.textContent = '0';
        }
    }

    // Загружаем отзывы во всплывающее окно
    function loadFloatingReviews() {
        const floatingList = document.getElementById('floatingReviewsList');
        if (!floatingList) return;

        if (localStorage.getItem('reviews')) {
            const reviews = JSON.parse(localStorage.getItem('reviews'));

            if (reviews.length === 0) {
                floatingList.innerHTML = '<p style="text-align: center; color: #666; padding: 15px;">Пока нет отзывов. Будьте первым!</p>';
                return;
            }

            let html = '';
            // Показываем последние 5 отзывов в обратном порядке (сначала новые)
            reviews.slice(-5).reverse().forEach(review => {
                html += createReviewHTML(review);
            });

            floatingList.innerHTML = html;
        } else {
            floatingList.innerHTML = '<p style="text-align: center; color: #666; padding: 15px;">Пока нет отзывов. Будьте первым!</p>';
        }
        updateReviewsCount();
    }

    // Обработчики событий
    floatingToggle.addEventListener('click', () => {
        floatingPanel.classList.toggle('show');
        if (floatingPanel.classList.contains('show')) {
            loadFloatingReviews();
        }
    });

    if (closeFloating) {
        closeFloating.addEventListener('click', () => {
            floatingPanel.classList.remove('show');
        });
    }

    if (floatingReviewBtn) {
        floatingReviewBtn.addEventListener('click', () => {
            // Закрываем панель и прокручиваем к форме отзыва на странице "О нас"
            floatingPanel.classList.remove('show');
            
            // Если мы не на странице "О нас", перенаправляем
            if (!window.location.pathname.includes('about.html')) {
                if (confirm('Перейти на страницу "О нас", чтобы оставить отзыв?')) {
                    window.location.href = 'about.html';
                }
            } else {
                // Прокручиваем к форме
                const reviewForm = document.getElementById('reviewForm');
                if (reviewForm) {
                    reviewForm.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // Загружаем отзывы при инициализации
    loadFloatingReviews();
    updateReviewsCount();
}

function updateFloatingReviews() {
    const floatingList = document.getElementById('floatingReviewsList');
    const reviewsCount = document.getElementById('reviewsCount');
    
    if (!floatingList) return;

    if (localStorage.getItem('reviews')) {
        const reviews = JSON.parse(localStorage.getItem('reviews'));
        
        if (reviews.length === 0) {
            floatingList.innerHTML = '<p style="text-align: center; color: #666; padding: 15px;">Пока нет отзывов. Будьте первым!</p>';
            if (reviewsCount) reviewsCount.textContent = '0';
            return;
        }

        let html = '';
        reviews.slice(-5).reverse().forEach(review => {
            html += createReviewHTML(review);
        });

        floatingList.innerHTML = html;
        if (reviewsCount) reviewsCount.textContent = reviews.length;
    } else {
        floatingList.innerHTML = '<p style="text-align: center; color: #666; padding: 15px;">Пока нет отзывов. Будьте первым!</p>';
        if (reviewsCount) reviewsCount.textContent = '0';
    }
}

// ==================== ДАТА ПИКЕР ====================
function initDatePicker() {
    // Инициализация Flatpickr
    if (typeof flatpickr !== 'undefined' && document.getElementById('selected-date')) {
        flatpickr("#selected-date", {
            dateFormat: "Y-m-d",
            locale: "ru",
            minDate: "today"
        });
    }

    // Обработчик кнопки проверки
    const checkBtn = document.getElementById('check-dates');
    if (checkBtn) {
        checkBtn.addEventListener('click', function() {
            const selectedDate = document.getElementById('selected-date');
            const timesDiv = document.getElementById('available-times');
            
            if (!timesDiv) return;
            
            if (!selectedDate || !selectedDate.value) {
                timesDiv.innerHTML = '<p style="color: #ff9800; margin-top: 15px;">⚠️ Пожалуйста, выберите дату</p>';
                return;
            }
            
            const dateStr = selectedDate.value;
            
            // Проверяем, есть ли расписание для этой даты
            if (availabilityData[dateStr]) {
                const slots = availabilityData[dateStr];
                
                if (slots.length === 1 && slots[0] === "11:00 - 20:00") {
                    timesDiv.innerHTML = `
                        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px; margin-top: 15px;">
                            <p style="color: #2e7d32; font-weight: bold; margin-bottom: 10px;">✅ Свободно весь день!</p>
                            <p style="color: #2e7d32;">Весь день: 11:00 - 20:00</p>
                        </div>
                    `;
                } else {
                    let slotsHtml = '';
                    slots.forEach(slot => {
                        slotsHtml += `<li style="margin: 5px 0; color: #2e7d32;">🕐 ${slot}</li>`;
                    });
                    
                    timesDiv.innerHTML = `
                        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 10px; margin-top: 15px;">
                            <p style="color: #2e7d32; font-weight: bold; margin-bottom: 10px;">✅ Свободное время на ${dateStr}:</p>
                            <ul style="list-style: none; padding: 0;">
                                ${slotsHtml}
                            </ul>
                        </div>
                    `;
                }
            } else {
                // Если нет точного расписания, показываем общую информацию
                const date = new Date(dateStr + 'T12:00:00');
                const dayOfWeek = date.getDay();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString('ru-RU', options);
                
                let dayType = (dayOfWeek === 0 || dayOfWeek === 6) ? 'выходной' : 'будний';
                
                timesDiv.innerHTML = `
                    <div style="background-color: #fff3e0; padding: 15px; border-radius: 10px; margin-top: 15px;">
                        <p style="color: #e65100; font-weight: bold;">ℹ️ На ${formattedDate} (${dayType} день)</p>
                        <p style="color: #666; margin-top: 10px;">Точное расписание уточняйте по телефону</p>
                        <a href="tel:89833688498" style="display: inline-block; margin-top: 10px; padding: 8px 15px; background: #332c78; color: white; text-decoration: none; border-radius: 50px; font-size: 14px;">
                            <i class="fas fa-phone-alt"></i> Позвонить
                        </a>
                    </div>
                `;
            }
        });
    }
}

// ==================== ФОРМА ОБРАТНОЙ СВЯЗИ ====================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
            contactForm.reset();
        });
    }
}