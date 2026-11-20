// --- Управление темой ---
        const themeToggle = document.getElementById('themeToggle');
        const rootElement = document.documentElement;
        
        const applyTheme = (theme) => {
            rootElement.setAttribute('data-theme', theme);
        };

        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (systemPrefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = rootElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        // --- Мобильное меню ---
        const burger = document.getElementById('burger');
        const navMenu = document.getElementById('navMenu');
        
        burger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            burger.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        function closeMenu() {
            navMenu.classList.remove('active');
            burger.textContent = '☰';
        }

        // --- Карусель ---
        function moveCarousel(trackId, direction) {
            const track = document.getElementById(trackId);
            const firstCard = track.querySelector('.carousel-card');
            if (!firstCard) return;

            const cardWidth = firstCard.offsetWidth + 15; 
            
            let currentScroll = track.dataset.scroll ? parseFloat(track.dataset.scroll) : 0;
            const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
            
            currentScroll += direction * cardWidth;
            
            if (currentScroll < 0) currentScroll = 0;
            if (currentScroll > maxScroll) currentScroll = maxScroll;

            track.dataset.scroll = currentScroll;
            track.style.transform = `translateX(-${currentScroll}px)`;
        }

        const carouselContainer = document.getElementById('carouselContainer');
        const track = document.getElementById('track1');
        
        carouselContainer.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault(); 
                
                const direction = e.deltaY > 0 ? 1 : -1;
                
                let currentScroll = track.dataset.scroll ? parseFloat(track.dataset.scroll) : 0;
                const maxScroll = track.scrollWidth - carouselContainer.offsetWidth;
                
                const scrollStep = 50; 
                currentScroll += direction * scrollStep;
                
                if (currentScroll < 0) currentScroll = 0;
                if (currentScroll > maxScroll) currentScroll = maxScroll;
                
                track.dataset.scroll = currentScroll;
                track.style.transform = `translateX(-${currentScroll}px)`;
            }
        }, { passive: false });

        // --- Анимация навыков ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.dataset.width;
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.skill-fill').forEach(fill => observer.observe(fill));

        // --- Логика Lightbox ---
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const carouselImages = Array.from(document.querySelectorAll('.carousel-card img'));
        let currentImageIndex = 0;

        function openLightbox(index) {
            currentImageIndex = index;
            lightboxImg.src = carouselImages[currentImageIndex].src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function changeImage(direction) {
            currentImageIndex += direction;
            
            if (currentImageIndex < 0) {
                currentImageIndex = carouselImages.length - 1;
            } else if (currentImageIndex >= carouselImages.length) {
                currentImageIndex = 0;
            }
            
            lightboxImg.src = carouselImages[currentImageIndex].src;
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
        });
