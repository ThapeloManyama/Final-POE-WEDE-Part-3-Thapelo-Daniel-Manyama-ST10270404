/* ============================================================
   MOKOPANE ARTISAN BAKERY & DELI
   External JavaScript File
   Author: Thapelo Manyama (ST10270404)
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       UTILITY FUNCTIONS (Shared across all pages)
    ============================================================ */

    // Toast notification system
    function showToast(message, duration = 3000) {
        let toast = document.getElementById('toast') || document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
    }

    // Smooth scroll to element
    function scrollToElement(element, offset = 80) {
        if (!element) return;
        const headerHeight = document.querySelector('.header, .navbar, .top-nav')?.offsetHeight || offset;
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }

    // Escape HTML for safe rendering
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Generate random order ID
    function generateOrderId(prefix = 'MAB') {
        return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /* ============================================================
       PAGE DETECTION
    ============================================================ */

    const pagePath = window.location.pathname.toLowerCase();
    const pageName = pagePath.split('/').pop() || 'index.html';

    const isAboutPage = pageName.includes('about');
    const isContactPage = pageName.includes('contact');
    const isEnquiryPage = pageName.includes('enquiry');
    const isHomePage = pageName.includes('index') || pageName === '' || pageName === '/';
    const isMenuPage = pageName.includes('menu');
    const isServicesPage = pageName.includes('services');

    /* ============================================================
       ABOUT US PAGE (About Us.html)
    ============================================================ */

    if (isAboutPage) {
        initAboutPage();
    }

    function initAboutPage() {
        // Hello welcome animation
        initHelloAnimation();

        // Cart sidebar
        initCartSidebar();

        // Hero slider
        initHeroSlider();

        // Header scroll effect
        initHeaderScroll();

        // Navigation active state
        initNavActiveState();

        // Contact form
        initContactForm();

        // Newsletter subscription
        initNewsletter();

        // Counters animation
        initCounters();

        // Values cloud shuffle/reset
        initValuesCloud();

        // Team quote button
        initTeamQuote();

        // Highlight why cards
        initHighlightWhyCards();

        // Scroll reveal animations
        initScrollReveal();

        // Lightbox for gallery
        initLightbox();

        // Tabs (Our Story section)
        initStoryTabs();

        // FAQ Accordion
        initFaqAccordion();

        // Team modal
        initTeamModal();

        // Chatbot widget
        initChatbotWidget();
    }

    /* ============================================================
       HELLO WELCOME ANIMATION
    ============================================================ */

    function initHelloAnimation() {
        const overlay = document.getElementById('helloOverlay');
        const skipBtn = document.getElementById('helloSkip');
        if (!overlay) return;

        document.body.style.overflow = 'hidden';
        let dismissed = false;

        function dismissHello() {
            if (dismissed) return;
            dismissed = true;
            overlay.classList.add('leaving');

            setTimeout(() => {
                overlay.classList.add('hide');
                document.body.style.overflow = '';
            }, 550);

            setTimeout(() => {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 1500);

            document.body.style.overflow = '';
        }

        const autoTimer = setTimeout(dismissHello, 4200);

        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                clearTimeout(autoTimer);
                dismissHello();
            });
        }

        document.addEventListener('keydown', function onEsc(e) {
            if (e.key === 'Escape' && !dismissed) {
                clearTimeout(autoTimer);
                dismissHello();
                document.removeEventListener('keydown', onEsc);
            }
        });

        setTimeout(() => {
            if (!dismissed) dismissHello();
        }, 8000);
    }

    /* ============================================================
       CART SIDEBAR (About Us page)
    ============================================================ */

    function initCartSidebar() {
        let cart = [];

        const cartToggle = document.getElementById('cartToggle');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCart = document.getElementById('closeCart');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.getElementById('cartCount');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!cartToggle || !cartSidebar) return;

        function getTotal() {
            return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        }

        function getCount() {
            return cart.reduce((sum, item) => sum + item.qty, 0);
        }

        function updateCartUI() {
            const count = getCount();
            if (cartCount) {
                cartCount.textContent = count;
                cartCount.style.display = count > 0 ? 'flex' : 'none';
            }

            if (cartItems) {
                if (cart.length === 0) {
                    cartItems.innerHTML = `
                        <div class="cart-empty">
                            <i class="fas fa-shopping-bag"></i>
                            <p>Your cart is empty.<br>Start adding delicious items!</p>
                        </div>`;
                } else {
                    cartItems.innerHTML = cart.map(item => `
                        <div class="cart-item">
                            <div style="font-size:1.8rem;width:44px;text-align:center;">${item.icon || '🥖'}</div>
                            <div class="item-info">
                                <h4>${escapeHtml(item.name)}</h4>
                                <div class="item-price">R ${(item.price * item.qty).toFixed(2)}</div>
                            </div>
                            <div class="item-qty">
                                <button onclick="window.updateQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
                                <span>${item.qty}</span>
                                <button onclick="window.updateQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
                            </div>
                            <button class="remove-item" onclick="window.removeFromCart(${item.id})" aria-label="Remove item"><i class="fas fa-trash"></i></button>
                        </div>
                    `).join('');
                }
            }

            if (cartTotal) {
                cartTotal.textContent = `R ${getTotal().toFixed(2)}`;
            }
        }

        function openCart() {
            cartSidebar.classList.add('open');
            if (cartOverlay) cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeCartFn() {
            cartSidebar.classList.remove('open');
            if (cartOverlay) cartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        cartToggle.addEventListener('click', openCart);
        if (closeCart) closeCart.addEventListener('click', closeCartFn);
        if (cartOverlay) cartOverlay.addEventListener('click', closeCartFn);

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function () {
                if (cart.length === 0) {
                    showToast('Your cart is empty. Add some items first!');
                    return;
                }
                const total = getTotal();
                showToast(`✅ Checkout — Total: R ${total.toFixed(2)}. We'll contact you shortly.`);
                cart = [];
                updateCartUI();
                closeCartFn();
            });
        }

        // Expose cart functions globally
        window.updateQty = function (id, delta) {
            const item = cart.find(i => i.id === id);
            if (!item) return;
            item.qty += delta;
            if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
            updateCartUI();
        };

        window.removeFromCart = function (id) {
            cart = cart.filter(item => item.id !== id);
            updateCartUI();
        };

        window.openCart = openCart;
        window.closeCartFn = closeCartFn;

        updateCartUI();
    }

    /* ============================================================
       HERO SLIDER (About Us page)
    ============================================================ */

    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('#heroDots span');
        if (!slides.length) return;

        let currentSlide = 0;
        let sliderInterval;

        function goToSlide(index) {
            slides.forEach((s, i) => s.classList.toggle('active', i === index));
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            currentSlide = index;
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', function () {
                const idx = parseInt(this.dataset.index);
                goToSlide(idx);
                resetSliderInterval();
            });
            dot.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        function resetSliderInterval() {
            clearInterval(sliderInterval);
            sliderInterval = setInterval(nextSlide, 5000);
        }

        sliderInterval = setInterval(nextSlide, 5000);
    }

    /* ============================================================
       HEADER SCROLL EFFECT
    ============================================================ */

    function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* ============================================================
       NAVIGATION ACTIVE STATE
    ============================================================ */

    function initNavActiveState() {
        const navLinks = document.getElementById('navLinks');
        if (!navLinks) return;

        const navAnchors = navLinks.querySelectorAll('a');

        function updateActiveNav() {
            const scrollY = window.scrollY + 120;
            let activeId = 'home';

            document.querySelectorAll('section[id], .hero[id]').forEach(el => {
                const rect = el.getBoundingClientRect();
                const top = rect.top + window.scrollY;
                const bottom = top + rect.height;
                if (scrollY >= top && scrollY < bottom && el.id) activeId = el.id;
            });

            navAnchors.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + activeId);
            });
        }

        window.addEventListener('scroll', debounce(updateActiveNav, 100), { passive: true });
        window.addEventListener('load', updateActiveNav);
    }

    /* ============================================================
       CONTACT FORM (About Us page)
    ============================================================ */

    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contactName')?.value.trim();
            const email = document.getElementById('contactEmail')?.value.trim();
            const message = document.getElementById('contactMessage')?.value.trim();

            if (!name || !email || !message) {
                showToast('Please fill in all required fields.');
                return;
            }

            showToast(`✅ Thank you, ${name}! We've received your message and will get back to you soon.`);
            this.reset();
        });
    }

    /* ============================================================
       NEWSLETTER SUBSCRIPTION (About Us page)
    ============================================================ */

    function initNewsletter() {
        const newsletterEmail = document.getElementById('newsletterEmail');
        const newsletterMsg = document.getElementById('newsletterMsg');
        const subscribeBtn = document.getElementById('subscribeBtn');

        if (!newsletterEmail || !subscribeBtn) return;

        subscribeBtn.addEventListener('click', function () {
            const email = newsletterEmail.value.trim();

            if (email === '') {
                newsletterMsg.textContent = 'Please enter your email address.';
                newsletterMsg.classList.add('error');
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                newsletterMsg.textContent = 'Please enter a valid email address.';
                newsletterMsg.classList.add('error');
                return;
            }

            newsletterMsg.textContent = '🎉 Thank you! You\'re now part of the bakery family.';
            newsletterMsg.classList.remove('error');
            newsletterEmail.value = '';
            setTimeout(() => { newsletterMsg.textContent = ''; }, 4000);
        });

        newsletterEmail.addEventListener('keypress', e => {
            if (e.key === 'Enter') subscribeBtn.click();
        });
    }

    /* ============================================================
       COUNTERS ANIMATION (About Us page)
    ============================================================ */

    function initCounters() {
        const counterSection = document.getElementById('counterSection');
        if (!counterSection) return;

        const counterLoaves = document.getElementById('counterLoaves');
        const counterCustomers = document.getElementById('counterCustomers');
        const counterYears = document.getElementById('counterYears');

        let countersAnimated = false;

        function animateCounter(element, target, duration = 1800) {
            if (!element) return;
            const startTime = performance.now();

            function update(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                element.textContent = Math.floor(eased * target).toLocaleString();
                if (progress < 1) requestAnimationFrame(update);
                else element.textContent = target.toLocaleString();
            }

            requestAnimationFrame(update);
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounter(counterLoaves, 1200);
                    animateCounter(counterCustomers, 8500);
                    animateCounter(counterYears, 7);
                }
            });
        }, { threshold: 0.4 });

        observer.observe(counterSection);
    }

    /* ============================================================
       VALUES CLOUD (About Us page)
    ============================================================ */

    function initValuesCloud() {
        const valuesCloud = document.getElementById('valuesCloud');
        const valueQuote = document.getElementById('valueQuote');
        const shuffleBtn = document.getElementById('shuffleValuesBtn');
        const resetBtn = document.getElementById('resetValuesBtn');

        if (!valuesCloud || !shuffleBtn) return;

        const originalValues = Array.from(valuesCloud.children).map(el => el.textContent);

        const valueQuotes = [
            "“Integrity is doing the right thing, even when no one is watching.”",
            "“Excellence is not a destination; it is a continuous journey.”",
            "“Innovation distinguishes between a leader and a follower.”",
            "“Customer satisfaction is our top priority, always.”",
            "“Teamwork makes the dream work — one loaf at a time.”",
            "“Accountability builds trust and trust builds community.”",
            "“Respect for ingredients, respect for people, respect for craft.”",
            "“Quality is never an accident; it is always the result of intelligent effort.”"
        ];

        shuffleBtn.addEventListener('click', function () {
            const items = Array.from(valuesCloud.children);
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            items.forEach(item => valuesCloud.appendChild(item));
            if (valueQuote) {
                valueQuote.textContent = valueQuotes[Math.floor(Math.random() * valueQuotes.length)];
                valueQuote.classList.add('highlight-flash');
                setTimeout(() => valueQuote.classList.remove('highlight-flash'), 1200);
            }
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                valuesCloud.innerHTML = '';
                originalValues.forEach(val => {
                    const span = document.createElement('span');
                    span.textContent = val;
                    valuesCloud.appendChild(span);
                });
                if (valueQuote) {
                    valueQuote.textContent = "Values restored to their original order. 🌿";
                }
            });
        }

        // Click on individual values
        valuesCloud.addEventListener('click', function (e) {
            if (e.target.tagName === 'SPAN' && valueQuote) {
                valueQuote.textContent = `“${e.target.textContent}” — one of our core values that guides every decision we make.`;
                valueQuote.classList.add('highlight-flash');
                setTimeout(() => valueQuote.classList.remove('highlight-flash'), 1000);
            }
        });
    }

    /* ============================================================
       TEAM QUOTE BUTTON (About Us page)
    ============================================================ */

    function initTeamQuote() {
        const teamQuoteBtn = document.getElementById('teamQuoteBtn');
        const teamQuoteDisplay = document.getElementById('teamQuoteDisplay');
        if (!teamQuoteBtn || !teamQuoteDisplay) return;

        const teamQuotes = [
            "“Every loaf is a little love letter to our community.” — Thandi",
            "“Cheese makes everything better. That's a fact.” — James",
            "“Butter, sugar, and a pinch of magic — that's my secret.” — Lerato",
            "“Coffee is not just a drink; it's an invitation to slow down.” — David",
            "“We're not just a bakery — we're a family.” — The whole team"
        ];

        teamQuoteBtn.addEventListener('click', function () {
            teamQuoteDisplay.textContent = teamQuotes[Math.floor(Math.random() * teamQuotes.length)];
            teamQuoteDisplay.classList.add('highlight-flash');
            setTimeout(() => teamQuoteDisplay.classList.remove('highlight-flash'), 1200);
        });
    }

    /* ============================================================
       HIGHLIGHT WHY CARDS (About Us page)
    ============================================================ */

    function initHighlightWhyCards() {
        const highlightBtn = document.getElementById('highlightWhyBtn');
        if (!highlightBtn) return;

        highlightBtn.addEventListener('click', function () {
            document.querySelectorAll('.why-card').forEach((card, index) => {
                card.style.transition = 'background 0.3s ease, transform 0.3s ease';
                card.style.background = '#f7e9d7';
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.background = '';
                    card.style.transform = '';
                }, 800 + index * 150);
            });
        });
    }

    /* ============================================================
       SCROLL REVEAL ANIMATIONS (About Us page)
    ============================================================ */

    function initScrollReveal() {
        const revealEls = document.querySelectorAll('.reveal');
        if (!revealEls.length) return;

        if (!('IntersectionObserver' in window)) {
            revealEls.forEach(el => el.classList.add('visible'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => io.observe(el));
    }

    /* ============================================================
       LIGHTBOX FOR GALLERY (About Us page)
    ============================================================ */

    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCaption = document.getElementById('lightboxCaption');
        const lightboxClose = document.getElementById('lightboxClose');

        if (!lightbox) return;

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const fullImg = item.dataset.img;
                const caption = item.dataset.caption || '';
                if (!fullImg) return;

                lightboxImg.src = fullImg;
                lightboxImg.alt = caption;
                lightboxCaption.textContent = caption;
                lightbox.classList.add('open');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                lightboxClose.focus();
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
        });
    }

    /* ============================================================
       STORY TABS (About Us page)
    ============================================================ */

    function initStoryTabs() {
        const tabBtns = document.querySelectorAll('#storyTabs .tab-btn');
        const panels = document.querySelectorAll('#storyTabs .tab-panel');

        if (!tabBtns.length) return;

        function activateTab(tabId) {
            tabBtns.forEach(btn => {
                const isActive = btn.dataset.tab === tabId;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
            panels.forEach(panel => {
                panel.classList.toggle('active', panel.id === 'tab-' + tabId);
            });
        }

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => activateTab(btn.dataset.tab));
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const list = Array.from(tabBtns);
                    const idx = list.indexOf(btn);
                    const next = e.key === 'ArrowRight'
                        ? list[(idx + 1) % list.length]
                        : list[(idx - 1 + list.length) % list.length];
                    next.focus();
                    next.click();
                }
            });
        });
    }

    /* ============================================================
       FAQ ACCORDION (About Us page)
    ============================================================ */

    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('#faqList .faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                faqItems.forEach(other => {
                    other.classList.remove('open');
                    other.querySelector('.faq-answer').style.maxHeight = null;
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ============================================================
       TEAM MODAL (About Us page)
    ============================================================ */

    function initTeamModal() {
        const modal = document.getElementById('teamModal');
        if (!modal) return;

        const modalClose = document.getElementById('modalClose');
        const modalPhoto = document.getElementById('modalPhoto');
        const modalName = document.getElementById('modalName');
        const modalRole = document.getElementById('modalRole');
        const modalBio = document.getElementById('modalBio');
        const modalFun = document.getElementById('modalFun');
        const modalChatBtn = document.getElementById('modalChatBtn');
        const modalWhatsApp = document.getElementById('modalWhatsApp');

        const staffData = {
            thandi: {
                name: 'Thandi Khumalo',
                role: 'Head Baker',
                photo: 'C:\\Users\\thape\\OneDrive\\Desktop\\Final POE WEDE Part 3 Thapelo Daniel Manyama ST10270404\\Picture of The website\\Thandi Khumalo.png',
                bio: 'Thandi leads our baking team with eight years of sourdough wisdom. She has perfected our signature slow-fermented loaves and mentors every baker who joins the team.',
                fun: '💡 Fun fact: Thandi names every sourdough starter she creates — the current one is called "Doughlene".',
                wa: 'I would love to chat about bread and baking!'
            },
            james: {
                name: 'James Kruger',
                role: 'Deli Manager',
                photo: 'C:\\Users\\thape\\OneDrive\\Desktop\\Final POE WEDE Part 3 Thapelo Daniel Manyama ST10270404\\Picture of The website\\James Kruger Deli Manager.png',
                bio: 'James is our cured meat and cheese connoisseur. He sources exceptional local produce and builds deli platters that have become a firm favourite in Mokopane.',
                fun: '💡 Fun fact: James can identify a cheese by smell alone — a skill he claims is "purely professional".',
                wa: 'Let me help you with the perfect deli platter!'
            },
            lerato: {
                name: 'Lerato Mokoena',
                role: 'Pastry Chef',
                photo: 'C:\\Users\\thape\\OneDrive\\Desktop\\Final POE WEDE Part 3 Thapelo Daniel Manyama ST10270404\\Picture of The website\\Lerato Mokoena.png',
                bio: 'Lerato is the artist behind our pastries and custom cakes. She blends classic French technique with local flavours, and her celebration cakes are legendary.',
                fun: '💡 Fun fact: Lerato once made a 5-tier wedding cake entirely from a tiny home oven. True story.',
                wa: 'Ready to talk cake? I can make your dream cake a reality!'
            },
            david: {
                name: 'David van Wyk',
                role: 'Head Barista',
                photo: 'C:\\Users\\thape\\OneDrive\\Desktop\\Final POE WEDE Part 3 Thapelo Daniel Manyama ST10270404\\Picture of The website\\David van Wyk.png',
                bio: 'David brews exceptional coffee and builds community. He knows most customers by name and their order by heart — he is the warm welcome at the heart of our bakery.',
                fun: '💡 Fun fact: David roasts his own coffee beans and has a secret blend reserved for rainy days.',
                wa: 'Let\'s talk coffee — or place an order, I am happy to help!'
            }
        };

        let currentMemberId = null;

        function openModal(id) {
            const data = staffData[id];
            if (!data) return;

            currentMemberId = id;
            modalPhoto.src = data.photo;
            modalPhoto.alt = data.name;
            modalName.textContent = data.name;
            modalRole.textContent = data.role;
            modalBio.textContent = data.bio;
            modalFun.textContent = data.fun;
            modalWhatsApp.href = 'https://wa.me/27151234567?text=' + encodeURIComponent('Hi ' + data.name + ', ' + data.wa);
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            modalClose.focus();
        }

        function closeModal() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        document.querySelectorAll('.team-card[data-member]').forEach(card => {
            card.addEventListener('click', () => openModal(card.dataset.member));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card.dataset.member);
                }
            });
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        });

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });

        if (modalChatBtn) {
            modalChatBtn.addEventListener('click', () => {
                if (!currentMemberId) return;
                closeModal();
                // Open the main chatbot with this staff member
                if (typeof window.openChatWithStaff === 'function') {
                    window.openChatWithStaff(currentMemberId);
                }
            });
        }
    }

    /* ============================================================
       CHATBOT WIDGET (About Us page)
    ============================================================ */

    function initChatbotWidget() {
        const chatLauncher = document.getElementById('chatLauncher');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose = document.getElementById('chatClose');
        const chatStaffPick = document.getElementById('chatStaffPick');
        const chatMessages = document.getElementById('chatMessages');
        const chatQuick = document.getElementById('chatQuick');
        const chatInputRow = document.getElementById('chatInputRow');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const chatHeaderName = document.getElementById('chatHeaderName');
        const chatHeaderStatus = document.getElementById('chatHeaderStatus');
        const chatHeaderAvatar = document.getElementById('chatHeaderAvatar');

        if (!chatLauncher || !chatWindow) return;

        const chatStaff = {
            thandi: {
                name: 'Thandi Khumalo',
                role: 'Head Baker',
                initials: 'TK',
                replies: {
                    bread: "Our first bake is ready at 07:00 sharp — sourdough, croissants, and baguettes. A second batch of pastries comes out around 11:00. For the best choice, come before 10:00!",
                    cake: "For cakes you'd best speak to Lerato, our Pastry Chef — I'll hand you over. But I can tell you our bakery cakes are made fresh every morning!",
                    location: "We're at 23 Church Street, Mokopane. There's street parking right outside. Come say hello!",
                    platter: "Deli platters are James's department — I'll connect you. In the meantime, our bread and pastries go beautifully with everything on his counter!",
                    greeting: "Hi! I'm Thandi, the Head Baker. Ask me about our bread, baking times, or sourdough. 🍞",
                    fallback: "That's a good question — let me check with the team. In the meantime, our first fresh bake is at 07:00 daily, and our sourdough is slow-fermented for 24 hours."
                }
            },
            james: {
                name: 'James Kruger',
                role: 'Deli Manager',
                initials: 'JK',
                replies: {
                    bread: "Bread is Thandi's craft — I'll hand you over. But I can tell you: nothing beats a fresh baguette with our deli cheese!",
                    cake: "Cakes are Lerato's department — I'll connect you. If you're planning a celebration platter to go with it, I'm your man.",
                    location: "23 Church Street, Mokopane — the deli counter is at the back, past the bread shelves. Look for the cheese!",
                    platter: "Absolutely! I build custom deli platters for any occasion. For 6–8 people I recommend the 'Mokopane Mezze'. Give me 24 hours' notice and I'll make it beautiful.",
                    greeting: "James here — Deli Manager. Ask me about platters, cured meats, cheeses, or catering. 🧀",
                    fallback: "Great question. I'd suggest popping in to taste for yourself — our deli counter is open all day. Anything specific you'd like me to check?"
                }
            },
            lerato: {
                name: 'Lerato Mokoena',
                role: 'Pastry Chef',
                initials: 'LM',
                replies: {
                    bread: "Bread is Thandi's domain — I'll connect you. But I do make the butter that goes on it!",
                    cake: "Yes! Custom cakes are my speciality. I recommend placing an order at least 5 days ahead — 2 weeks for elaborate designs. Tell me the occasion and I'll design something unforgettable. 🎂",
                    location: "We're at 23 Church Street, Mokopane. The pastry counter is the first thing you'll see — dangerous, I know!",
                    platter: "Platters are James's department — I'll hand you over. But if you want dessert platters, I'm your chef!",
                    greeting: "Hello! Lerato here — Pastry Chef. Ask me about cakes, pastries, or custom orders. 🍰",
                    fallback: "Ooh, lovely question! For pastries, I bake fresh every morning. For custom orders, just tell me the occasion and your ideas and I'll take it from there."
                }
            },
            david: {
                name: 'David van Wyk',
                role: 'Head Barista',
                initials: 'DW',
                replies: {
                    bread: "Bread comes out at 07:00 — and it pairs perfectly with a flat white. That's my professional opinion. ☕",
                    cake: "Cakes are Lerato's art — I'll connect you. My tip: a slice of her chocolate cake with an espresso is a life-changing combo.",
                    location: "23 Church Street, Mokopane. Grab a coffee while you're here — first one's a hello from me!",
                    platter: "James makes the platters — I'll hand you over. I'll put the kettle on in the meantime.",
                    greeting: "Hey! David here — Head Barista. Ask me about coffee, orders, or opening times. ☕",
                    fallback: "Good question! I'm best on coffee, orders, and opening times — but I can connect you to Thandi, James, or Lerato for anything else. What would you like?"
                }
            }
        };

        let activeStaffId = null;

        function openChat(preferredId) {
            chatWindow.classList.add('open');
            chatLauncher.style.display = 'none';

            if (preferredId && chatStaff[preferredId]) {
                startChatWith(preferredId);
            } else if (!activeStaffId) {
                showStaffPicker();
            }

            setTimeout(() => {
                if (activeStaffId) chatInput.focus();
            }, 350);
        }

        function closeChat() {
            chatWindow.classList.remove('open');
            chatLauncher.style.display = 'flex';
        }

        function showStaffPicker() {
            activeStaffId = null;
            chatStaffPick.style.display = 'block';
            chatMessages.style.display = 'none';
            chatQuick.style.display = 'none';
            chatInputRow.style.display = 'none';
            chatHeaderName.textContent = 'Bakery Team';
            chatHeaderStatus.textContent = 'Online — pick a team member';
            chatHeaderAvatar.innerHTML = '<i class="fas fa-bread-slice"></i>';
        }

        function startChatWith(staffId) {
            const staff = chatStaff[staffId];
            if (!staff) return;

            activeStaffId = staffId;
            chatStaffPick.style.display = 'none';
            chatMessages.style.display = 'flex';
            chatQuick.style.display = 'flex';
            chatInputRow.style.display = 'flex';

            chatHeaderName.textContent = staff.name;
            chatHeaderStatus.textContent = staff.role + ' · Online';
            chatHeaderAvatar.textContent = staff.initials;

            chatMessages.innerHTML = '';
            addBubble(staff.greeting, 'bot', staff.name);
            chatInput.focus();
        }

        function addBubble(text, who, name) {
            const bubble = document.createElement('div');
            bubble.className = 'chat-bubble ' + who;

            if (who === 'bot' && name) {
                const nameSpan = document.createElement('span');
                nameSpan.className = 'bubble-name';
                nameSpan.textContent = name;
                bubble.appendChild(nameSpan);
            }

            bubble.appendChild(document.createTextNode(text));
            chatMessages.appendChild(bubble);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTyping() {
            const typing = document.createElement('div');
            typing.className = 'chat-typing';
            typing.id = 'chatTyping';
            typing.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(typing);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTyping() {
            const typing = document.getElementById('chatTyping');
            if (typing) typing.remove();
        }

        function generateReply(staffId, message) {
            const staff = chatStaff[staffId];
            const msg = message.toLowerCase();

            if (msg.includes('bread') || msg.includes('bake') || msg.includes('sourdough') || msg.includes('time')) {
                return staff.replies.bread;
            }
            if (msg.includes('cake') || msg.includes('custom') || msg.includes('birthday') || msg.includes('wedding')) {
                return staff.replies.cake;
            }
            if (msg.includes('where') || msg.includes('located') || msg.includes('address') || msg.includes('directions') || msg.includes('find you')) {
                return staff.replies.location;
            }
            if (msg.includes('platter') || msg.includes('deli') || msg.includes('cheese') || msg.includes('meat') || msg.includes('catering')) {
                return staff.replies.platter;
            }
            if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('good morning')) {
                return 'Hello! ' + staff.replies.greeting;
            }

            return staff.replies.fallback;
        }

        function sendMessage() {
            const text = chatInput.value.trim();
            if (!text || !activeStaffId) return;

            addBubble(text, 'user');
            chatInput.value = '';

            showTyping();
            setTimeout(() => {
                hideTyping();
                const reply = generateReply(activeStaffId, text);
                addBubble(reply, 'bot', chatStaff[activeStaffId].name);
                setTimeout(() => {
                    if (activeStaffId) {
                        addBubble('If I can\'t help with this, I\'ll get a colleague to jump in — or you can call us on +27 15 123 4567.', 'bot', chatStaff[activeStaffId].name);
                    }
                }, 1400);
            }, 900);
        }

        chatLauncher.addEventListener('click', () => openChat());
        chatClose.addEventListener('click', closeChat);

        document.querySelectorAll('#chatStaffPick .staff-option').forEach(btn => {
            btn.addEventListener('click', () => startChatWith(btn.dataset.staff));
        });

        document.querySelectorAll('#chatQuick button').forEach(btn => {
            btn.addEventListener('click', () => {
                chatInput.value = btn.dataset.quick;
                sendMessage();
            });
        });

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatWindow.classList.contains('open')) closeChat();
        });

        // Expose openChatWithStaff globally for team modal
        window.openChatWithStaff = function (staffId) {
            openChat(staffId);
        };
    }

    /* ============================================================
       CONTACT US PAGE (Contact Us.html)
    ============================================================ */

    if (isContactPage) {
        initContactPage();
    }

    function initContactPage() {
        // Update copyright year
        const yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }

        // Live opening status
        initOpeningStatus();

        // Character counter
        initCharCounter();

        // Contact form (mailto)
        initContactMailtoForm();

        // Back to top button
        initBackToTop();

        // Smooth anchor offset for sticky header
        initSmoothAnchorOffset();
    }

    function initOpeningStatus() {
        const statusEl = document.getElementById('open-status');
        if (!statusEl) return;

        function updateOpeningStatus() {
            const parts = new Intl.DateTimeFormat("en-ZA", {
                timeZone: "Africa/Johannesburg",
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23"
            }).formatToParts(new Date());

            const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
            const day = values.weekday;
            const minutes = Number(values.hour) * 60 + Number(values.minute);

            const opening = (day === "Sat" || day === "Sun") ? 7 * 60 : 6 * 60;
            const closing = day === "Sun" ? 13 * 60 : day === "Sat" ? 16 * 60 : 18 * 60;

            const open = minutes >= opening && minutes < closing;

            statusEl.textContent = open
                ? "● Within listed opening hours"
                : "● Currently outside listed opening hours";
            statusEl.style.color = open ? "#28643a" : "#8c3d1c";
        }

        updateOpeningStatus();
        setInterval(updateOpeningStatus, 60 * 1000);
    }

    function initCharCounter() {
        const messageField = document.getElementById("message");
        const charCount = document.getElementById("char-count");

        if (!messageField || !charCount) return;

        function updateCharCount() {
            const len = messageField.value.length;
            charCount.textContent = `${len} / 2000 characters`;
            if (len > 1800) {
                charCount.style.color = "#b94f27";
            } else {
                charCount.style.color = "var(--muted)";
            }
        }

        messageField.addEventListener("input", updateCharCount);
        updateCharCount();
    }

    function initContactMailtoForm() {
        const form = document.getElementById("contact-form");
        const formStatus = document.getElementById("form-status");

        if (!form) return;

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.reportValidity()) return;

            const data = new FormData(form);
            const subject = `Website enquiry: ${data.get("topic")}`;
            const body = [
                `Name: ${data.get("name")}`,
                `Email: ${data.get("email")}`,
                `Phone: ${data.get("phone") || "Not provided"}`,
                `Enquiry type: ${data.get("topic")}`,
                "",
                "Message:",
                data.get("message")
            ].join("\n");

            if (formStatus) {
                formStatus.textContent = "Your email app should open. Review the message and press Send there.";
                formStatus.classList.add("visible");

                setTimeout(() => {
                    formStatus.classList.remove("visible");
                }, 6000);
            }

            window.location.href = `mailto:info@mokopanebakery.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    function initBackToTop() {
        const backTop = document.getElementById("back-top");
        if (!backTop) return;

        window.addEventListener("scroll", () => {
            backTop.classList.toggle("visible", window.scrollY > 450);
        }, { passive: true });

        backTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function initSmoothAnchorOffset() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                const targetId = this.getAttribute("href");
                if (targetId === "#") return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    /* ============================================================
       ENQUIRY PAGE (Enquiry.html)
    ============================================================ */

    if (isEnquiryPage) {
        initEnquiryPage();
    }

    function initEnquiryPage() {
        // Navigation - mobile hamburger toggle
        initEnquiryNav();

        // Form validation and submission
        initEnquiryForm();

        // Chatbot
        initEnquiryChatbot();

        // Hidden shortcut: Ctrl+Shift+D to prefill demo data
        initDemoPrefillShortcut();
    }

    function initEnquiryNav() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');

        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 820) {
                    navLinks.classList.remove('open');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        document.addEventListener('click', function (event) {
            if (window.innerWidth <= 820) {
                const isClickInsideNav = navToggle.contains(event.target) || navLinks.contains(event.target);
                if (!isClickInsideNav && navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 820) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function initEnquiryForm() {
        const form = document.getElementById('enquiryForm');
        const feedback = document.getElementById('formFeedback');
        const resetBtn = document.getElementById('resetBtn');

        if (!form) return;

        const fullname = document.getElementById('fullname');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const serviceRadios = document.querySelectorAll('input[name="service_type"]');
        const serviceSpecify = document.getElementById('service_specify');
        const message = document.getElementById('message');
        const charCounter = document.getElementById('charCounter');

        const fullnameError = document.getElementById('fullnameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const messageError = document.getElementById('messageError');

        function showFeedback(type, text) {
            feedback.className = 'form-feedback ' + type;
            feedback.textContent = text;
            feedback.style.display = 'block';
            feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function clearFeedback() {
            feedback.className = 'form-feedback';
            feedback.textContent = '';
            feedback.style.display = 'none';
        }

        function clearFieldError(field, errorElement) {
            if (field) field.classList.remove('field-error', 'field-valid');
            if (errorElement) errorElement.textContent = '';
        }

        function markFieldError(field, errorElement, msg) {
            if (field) {
                field.classList.add('field-error');
                field.classList.remove('field-valid');
            }
            if (errorElement) errorElement.textContent = msg;
        }

        function markFieldValid(field, errorElement) {
            if (field) {
                field.classList.remove('field-error');
                field.classList.add('field-valid');
            }
            if (errorElement) errorElement.textContent = '';
        }

        function validateFullname() {
            const value = fullname.value.trim();
            if (!value) {
                markFieldError(fullname, fullnameError, 'Full name is required.');
                return false;
            }
            if (value.length < 2) {
                markFieldError(fullname, fullnameError, 'Name must be at least 2 characters.');
                return false;
            }
            if (!/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s'\-\.]+$/.test(value)) {
                markFieldError(fullname, fullnameError, 'Please enter a valid name (letters, spaces, hyphens, apostrophes).');
                return false;
            }
            markFieldValid(fullname, fullnameError);
            return true;
        }

        function validateEmail() {
            const value = email.value.trim();
            if (!value) {
                markFieldError(email, emailError, 'Email address is required.');
                return false;
            }
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailRegex.test(value)) {
                markFieldError(email, emailError, 'Please enter a valid email address (e.g. name@example.com).');
                return false;
            }
            markFieldValid(email, emailError);
            return true;
        }

        function validatePhone() {
            const value = phone.value.trim();
            if (!value) {
                clearFieldError(phone, phoneError);
                return true;
            }
            const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
            if (!phoneRegex.test(value)) {
                markFieldError(phone, phoneError, 'Please enter a valid phone number (digits, spaces, +, -, parentheses).');
                return false;
            }
            markFieldValid(phone, phoneError);
            return true;
        }

        function getSelectedService() {
            let selected = null;
            serviceRadios.forEach(function (radio) {
                if (radio.checked) selected = radio.value;
            });
            return selected;
        }

        function validateServiceType() {
            const selected = getSelectedService();
            const group = document.getElementById('serviceRadioGroup');
            if (!selected) {
                group.style.border = '2px solid #c0392b';
                group.style.boxShadow = '0 0 0 4px rgba(192, 57, 43, 0.08)';
                return false;
            }
            group.style.border = '1px solid #ece0d6';
            group.style.boxShadow = 'none';
            return true;
        }

        function validateServiceSpecify() {
            const selected = getSelectedService();
            const value = serviceSpecify.value.trim();
            if (selected === 'other' && !value) {
                serviceSpecify.style.borderColor = '#c0392b';
                serviceSpecify.style.background = '#fff5f5';
                return false;
            }
            serviceSpecify.style.borderColor = '';
            serviceSpecify.style.background = '';
            return true;
        }

        function validateMessage() {
            const value = message.value.trim();
            if (!value) {
                markFieldError(message, messageError, 'Please provide a message with your enquiry.');
                return false;
            }
            if (value.length < 10) {
                markFieldError(message, messageError, 'Message must be at least 10 characters.');
                return false;
            }
            if (value.length > 800) {
                markFieldError(message, messageError, 'Message must not exceed 800 characters.');
                return false;
            }
            markFieldValid(message, messageError);
            return true;
        }

        function updateCharCounter() {
            const len = message.value.length;
            charCounter.textContent = len + ' / 800 characters';
            if (len > 750) {
                charCounter.classList.add('warning');
            } else {
                charCounter.classList.remove('warning');
            }
        }

        function validateForm() {
            const isNameValid = validateFullname();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isServiceValid = validateServiceType();
            const isSpecifyValid = validateServiceSpecify();
            const isMessageValid = validateMessage();

            const isValid = isNameValid && isEmailValid && isPhoneValid && isServiceValid && isSpecifyValid && isMessageValid;

            if (!isValid) {
                const firstError = document.querySelector('.field-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    const group = document.getElementById('serviceRadioGroup');
                    if (group.style.border === '2px solid #c0392b') {
                        group.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }

            return isValid;
        }

        function resetValidation() {
            clearFeedback();
            clearFieldError(fullname, fullnameError);
            clearFieldError(email, emailError);
            clearFieldError(phone, phoneError);
            clearFieldError(message, messageError);

            serviceSpecify.style.borderColor = '';
            serviceSpecify.style.background = '';

            const group = document.getElementById('serviceRadioGroup');
            group.style.border = '1px solid #ece0d6';
            group.style.boxShadow = 'none';

            updateCharCounter();
        }

        fullname.addEventListener('blur', validateFullname);
        email.addEventListener('blur', validateEmail);
        phone.addEventListener('blur', validatePhone);
        message.addEventListener('blur', validateMessage);

        fullname.addEventListener('input', function () {
            if (fullname.classList.contains('field-error')) validateFullname();
        });
        email.addEventListener('input', function () {
            if (email.classList.contains('field-error')) validateEmail();
        });
        phone.addEventListener('input', function () {
            if (phone.classList.contains('field-error')) validatePhone();
        });
        message.addEventListener('input', function () {
            updateCharCounter();
            if (message.classList.contains('field-error')) validateMessage();
        });

        serviceRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                validateServiceType();
                validateServiceSpecify();
            });
        });

        serviceSpecify.addEventListener('input', function () {
            if (getSelectedService() === 'other') {
                validateServiceSpecify();
            }
        });

        updateCharCounter();

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            clearFeedback();

            if (!validateForm()) {
                showFeedback('error', 'Please correct the errors above before submitting.');
                return;
            }

            const formData = new FormData(form);
            const data = {};
            formData.forEach(function (value, key) {
                if (key.endsWith('[]')) {
                    if (!data[key]) data[key] = [];
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            });

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';

            setTimeout(function () {
                showFeedback('success', '✓ Thank you, ' + (data.fullname || 'friend') + '! Your enquiry has been sent successfully. We will respond within 24 hours.');
                form.reset();
                resetValidation();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log('Enquiry submitted:', data);
            }, 1500);
        });

        resetBtn.addEventListener('click', function (event) {
            event.preventDefault();
            form.reset();
            resetValidation();
            clearFeedback();
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function initEnquiryChatbot() {
        const chatLauncher = document.getElementById('chatLauncher');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose = document.getElementById('chatClose');
        const chatMessages = document.getElementById('chatMessages');
        const chatForm = document.getElementById('chatForm');
        const chatInput = document.getElementById('chatInput');
        const chatQuickReplies = document.getElementById('chatQuickReplies');

        if (!chatLauncher || !chatWindow) return;

        let chatOpen = false;
        let conversationState = 'idle';

        const BAKERY_INFO = {
            name: 'Mokopane Artisan Bakery & Deli',
            address: '123 Market Street, Mokopane Central, Limpopo, 0600, South Africa',
            phone: '+27 12 345 6789',
            whatsapp: '+27 82 123 4567',
            email: 'enquiries@mokopaneartisan.co.za',
            hours: {
                weekdays: 'Monday – Friday: 07:00 – 17:00',
                saturday: 'Saturday: 08:00 – 14:00',
                sunday: 'Sunday: Closed'
            },
            mapsLink: 'https://www.google.com/maps/dir/?api=1&destination=Mokopane,+Limpopo,+South+Africa'
        };

        const FAKE_ORDERS = {
            'MAB-1001': { status: 'Ready for collection', items: '2× Sourdough loaves, 6× Croissants', ready: 'Today, 14:00' },
            'MAB-1002': { status: 'Being prepared', items: '1× Celebration cake (chocolate)', ready: 'Tomorrow, 10:00' },
            'MAB-1003': { status: 'Out for delivery', items: 'Deli platter for 20 people', ready: 'Today, 16:30' },
            'MAB-1004': { status: 'Awaiting confirmation', items: 'Wholesale order – 50 artisan rolls', ready: 'Pending' },
            'MAB-1005': { status: 'Ready for collection', items: '2× Rye loaves, 1× Ciabatta', ready: 'Today, 12:00' }
        };

        function formatBotMessage(text) {
            let html = escapeHtml(text);
            html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/\n/g, '<br>');
            return html;
        }

        function addMessage(sender, text, options) {
            options = options || {};
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-msg ' + sender;

            const avatar = document.createElement('div');
            avatar.className = 'msg-avatar';
            avatar.setAttribute('aria-hidden', 'true');
            avatar.textContent = sender === 'bot' ? '🥐' : '🧑';

            const bubble = document.createElement('div');
            bubble.className = 'msg-bubble';

            if (options.html) {
                bubble.innerHTML = text;
            } else {
                bubble.innerHTML = formatBotMessage(text);
            }

            msgDiv.appendChild(avatar);
            msgDiv.appendChild(bubble);
            chatMessages.appendChild(msgDiv);
            scrollChatToBottom();
            return msgDiv;
        }

        function scrollChatToBottom() {
            requestAnimationFrame(function () {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        }

        function showTypingIndicator() {
            const typing = document.createElement('div');
            typing.className = 'chat-typing';
            typing.id = 'chatTyping';

            const avatar = document.createElement('div');
            avatar.className = 'msg-avatar';
            avatar.setAttribute('aria-hidden', 'true');
            avatar.textContent = '🥐';

            const dots = document.createElement('div');
            dots.className = 'typing-dots';
            dots.innerHTML = '<span></span><span></span><span></span>';

            typing.appendChild(avatar);
            typing.appendChild(dots);
            chatMessages.appendChild(typing);
            scrollChatToBottom();
            return typing;
        }

        function removeTypingIndicator() {
            const t = document.getElementById('chatTyping');
            if (t) t.remove();
        }

        function setQuickReplies(replies) {
            chatQuickReplies.innerHTML = '';
            if (!replies || replies.length === 0) {
                chatQuickReplies.style.display = 'none';
                return;
            }
            chatQuickReplies.style.display = 'flex';
            replies.forEach(function (reply) {
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'chat-chip';
                chip.textContent = reply.label;
                chip.addEventListener('click', function () {
                    handleUserMessage(reply.value || reply.label);
                });
                chatQuickReplies.appendChild(chip);
            });
        }

        function detectIntent(text) {
            const t = text.toLowerCase().trim();

            if (/(track|where.*(order|my order)|order status|order number|MAB-?\d+)/i.test(t)) return 'track_order';
            if (/(direction|how.*(get|find|reach)|where.*(are|is|located)|address|location|find you|visit|map|navigate|come to)/i.test(t)) return 'directions';
            if (/(hour|open|close|when.*open|time.*open|what time|business hours|trading hours)/i.test(t)) return 'hours';
            if (/(contact|phone|call|email|whatsapp|reach you|number)/i.test(t)) return 'contact';
            if (/(menu|product|what.*(sell|offer|have)|bread|pastry|cake|deli|sourdough|croissant)/i.test(t)) return 'products';
            if (/(cater|event|function|party|order|wholesale|bulk|platter|service)/i.test(t)) return 'services';
            if (/^(hi|hello|hey|good (morning|afternoon|evening)|greetings|howzit|hiya)\b/i.test(t)) return 'greeting';
            if (/(thank|thanks|cheers|appreciate)/i.test(t)) return 'thanks';
            if (/(bye|goodbye|see you|cheers|farewell)/i.test(t)) return 'bye';
            return 'unknown';
        }

        function getBotResponse(text) {
            const intent = detectIntent(text);

            if (conversationState === 'awaiting_order_number') {
                const orderMatch = text.match(/MAB-?\s*(\d{1,6})/i);
                if (orderMatch) {
                    const orderNumber = 'MAB-' + orderMatch[1];
                    return handleOrderTracking(orderNumber);
                } else if (/(cancel|never mind|stop|back|no)/i.test(text)) {
                    conversationState = 'idle';
                    setQuickReplies(getDefaultQuickReplies());
                    return "No problem! Let me know if there's anything else I can help you with. 😊";
                } else {
                    return "I didn't quite catch that order number. It should look like **MAB-1001**. Could you please type it again? Or say **cancel** to go back.";
                }
            }

            if (conversationState === 'awaiting_direction_address') {
                conversationState = 'idle';
                setQuickReplies(getDefaultQuickReplies());
                return "Thanks! For turn-by-turn directions from your location, please use the **Get Directions** button on the map above, or click here:\n\n🔗 " + BAKERY_INFO.mapsLink + "\n\nOur address is:\n📍 **" + BAKERY_INFO.address + "**\n\nWe look forward to seeing you! 🥐";
            }

            switch (intent) {
                case 'greeting':
                    return "Hello! 👋 Welcome to **Mokopane Artisan Bakery & Deli**. I'm here to help you with:\n\n• 🗺️ **Directions** to our deli\n• 📦 **Tracking your order**\n• ⏰ Our opening hours\n• 📞 Contact details\n\nWhat would you like to do?";

                case 'directions':
                    conversationState = 'awaiting_direction_address';
                    setQuickReplies([
                        { label: '🗺️ Open in Google Maps', value: 'open maps' },
                        { label: '📋 Copy address', value: 'copy address' },
                        { label: '↩️ Back to menu', value: 'menu' }
                    ]);
                    return "I'd be happy to help you find us! 🗺️\n\n📍 **Our address:**\n" + BAKERY_INFO.address + "\n\n⏰ **Business hours:**\n• " + BAKERY_INFO.hours.weekdays + "\n• " + BAKERY_INFO.hours.saturday + "\n• " + BAKERY_INFO.hours.sunday + "\n\nYou can click **Get Directions** below for turn-by-turn navigation from your current location, or use the map on this page. Would you like me to open Google Maps for you?";

                case 'track_order':
                    conversationState = 'awaiting_order_number';
                    setQuickReplies([
                        { label: '📦 MAB-1001', value: 'MAB-1001' },
                        { label: '📦 MAB-1002', value: 'MAB-1002' },
                        { label: '📦 MAB-1003', value: 'MAB-1003' },
                        { label: '↩️ Back to menu', value: 'menu' }
                    ]);
                    return "Sure! I can help you track your order. 📦\n\nPlease enter your **order number** (it looks like **MAB-1001**). If you don't have it handy, you can pick one of the sample orders below to see how tracking works:";

                case 'hours':
                    setQuickReplies(getDefaultQuickReplies());
                    return "⏰ **Our business hours:**\n\n• " + BAKERY_INFO.hours.weekdays + "\n• " + BAKERY_INFO.hours.saturday + "\n• " + BAKERY_INFO.hours.sunday + "\n\nWe're open bright and early for fresh bread! 🥖";

                case 'contact':
                    setQuickReplies(getDefaultQuickReplies());
                    return "📞 **Here's how to reach us:**\n\n• **Phone:** " + BAKERY_INFO.phone + "\n• **WhatsApp:** " + BAKERY_INFO.whatsapp + "\n• **Email:** " + BAKERY_INFO.email + "\n\nFeel free to call, WhatsApp, or email us — we usually respond within 24 hours. 😊";

                case 'products':
                    setQuickReplies(getDefaultQuickReplies());
                    return "🥐 **Some of our favourites:**\n\n• Sourdough breads\n• Croissants & danishes\n• Celebration cakes\n• Artisan loaves (rye, ciabatta)\n• Deli items (cheeses, cured meats, olives)\n\nFor the full menu or to place a custom order, please fill in our **Enquiry Form** above, or pop in and visit us! 🍞";

                case 'services':
                    setQuickReplies(getDefaultQuickReplies());
                    return "🎉 **We offer:**\n\n• Catering for events & functions\n• Custom orders (breads, pastries, cakes)\n• Wholesale / bulk supply\n• Deli platters & grazing boards\n\nTo get a quote or place an order, please complete the **Enquiry Form** on this page. We'll get back to you within 24 hours! 📝";

                case 'thanks':
                    setQuickReplies(getDefaultQuickReplies());
                    return "You're very welcome! 😊 Is there anything else I can help you with?";

                case 'bye':
                    setQuickReplies(getDefaultQuickReplies());
                    return "Goodbye! 👋 Thanks for stopping by Mokopane Artisan Bakery & Deli. We hope to see you soon! 🥐";

                default:
                    setQuickReplies(getDefaultQuickReplies());
                    return "I'm not sure I understood that. 🤔 I can help you with:\n\n• 🗺️ **Directions** to our deli\n• 📦 **Tracking your order**\n• ⏰ **Opening hours**\n• 📞 **Contact details**\n• 🥐 **Our products & services**\n\nJust type what you need, or tap a suggestion below!";
            }
        }

        function handleOrderTracking(orderNumber) {
            const normalized = orderNumber.toUpperCase().replace(/\s+/g, '');
            const order = FAKE_ORDERS[normalized];

            if (order) {
                conversationState = 'idle';
                setQuickReplies(getDefaultQuickReplies());
                return "📦 **Order " + normalized + "**\n\n" +
                    "**Status:** " + order.status + "\n" +
                    "**Items:** " + order.items + "\n" +
                    "**Ready:** " + order.ready + "\n\n" +
                    (order.status === 'Ready for collection'
                        ? "🎉 Your order is ready! Pop in during business hours to collect it. Don't forget to bring your order number."
                        : order.status === 'Out for delivery'
                            ? "🚚 Your order is on its way! Please ensure someone is available to receive it."
                            : order.status === 'Being prepared'
                                ? "👩‍🍳 We're working on your order with love. We'll have it ready soon!"
                                : "⏳ We're awaiting confirmation. Our team will be in touch shortly.");
            } else {
                conversationState = 'idle';
                setQuickReplies(getDefaultQuickReplies());
                return "Hmm, I couldn't find an order with the number **" + escapeHtml(normalized) + "**. 😕\n\nPlease double-check the number (it should look like **MAB-1001**), or contact us directly:\n\n📞 " + BAKERY_INFO.phone + "\n📧 " + BAKERY_INFO.email;
            }
        }

        function getDefaultQuickReplies() {
            return [
                { label: '🗺️ Directions', value: 'directions' },
                { label: '📦 Track order', value: 'track my order' },
                { label: '⏰ Hours', value: 'opening hours' },
                { label: '📞 Contact', value: 'contact details' }
            ];
        }

        function handleUserMessage(text) {
            text = String(text || '').trim();
            if (!text) return;

            const lower = text.toLowerCase();
            if (lower === 'menu' || lower === 'back' || lower === 'back to menu') {
                conversationState = 'idle';
                addMessage('user', text);
                setTimeout(function () {
                    addMessage('bot', "What would you like to do?");
                    setQuickReplies(getDefaultQuickReplies());
                }, 400);
                return;
            }

            if (lower === 'open maps' || lower === 'open in google maps') {
                conversationState = 'idle';
                addMessage('user', text);
                setTimeout(function () {
                    addMessage('bot', "Opening Google Maps for you… 🗺️\n\nIf it doesn't open automatically, click here:\n🔗 " + BAKERY_INFO.mapsLink);
                    setQuickReplies(getDefaultQuickReplies());
                    window.open(BAKERY_INFO.mapsLink, '_blank', 'noopener,noreferrer');
                }, 500);
                return;
            }

            if (lower === 'copy address' || lower === 'copy') {
                conversationState = 'idle';
                addMessage('user', text);
                const address = BAKERY_INFO.address;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(address).then(function () {
                        setTimeout(function () {
                            addMessage('bot', "✅ Address copied to clipboard:\n\n📍 **" + address + "**");
                            setQuickReplies(getDefaultQuickReplies());
                        }, 400);
                    }).catch(function () {
                        setTimeout(function () {
                            addMessage('bot', "📍 **Our address:**\n" + address);
                            setQuickReplies(getDefaultQuickReplies());
                        }, 400);
                    });
                } else {
                    setTimeout(function () {
                        addMessage('bot', "📍 **Our address:**\n" + address);
                        setQuickReplies(getDefaultQuickReplies());
                    }, 400);
                }
                return;
            }

            addMessage('user', text);
            chatInput.value = '';
            setQuickReplies([]);
            showTypingIndicator();

            const delay = 700 + Math.random() * 700;
            setTimeout(function () {
                removeTypingIndicator();
                const response = getBotResponse(text);
                addMessage('bot', response);
            }, delay);
        }

        function openChat() {
            chatOpen = true;
            chatWindow.classList.add('open');
            chatLauncher.classList.add('open');
            chatLauncher.setAttribute('aria-expanded', 'true');
            chatLauncher.setAttribute('aria-label', 'Close chat assistant');
            setTimeout(function () { chatInput.focus(); }, 320);
        }

        function closeChat() {
            chatOpen = false;
            chatWindow.classList.remove('open');
            chatLauncher.classList.remove('open');
            chatLauncher.setAttribute('aria-expanded', 'false');
            chatLauncher.setAttribute('aria-label', 'Open chat assistant');
        }

        function toggleChat() {
            if (chatOpen) closeChat();
            else openChat();
        }

        function initChat() {
            addMessage('bot',
                "Hi there! 👋 I'm the **Mokopane Assistant**.\n\nI can help you with:\n• 🗺️ **Directions** to our deli\n• 📦 **Tracking your order**\n• ⏰ **Opening hours**\n• 📞 **Contact details**\n\nHow can I help you today?"
            );
            setQuickReplies(getDefaultQuickReplies());
        }

        chatLauncher.addEventListener('click', toggleChat);
        chatClose.addEventListener('click', closeChat);

        chatForm.addEventListener('submit', function (event) {
            event.preventDefault();
            handleUserMessage(chatInput.value);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && chatOpen) {
                closeChat();
            }
        });

        initChat();
    }

    function initDemoPrefillShortcut() {
        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                const fullname = document.getElementById('fullname');
                const email = document.getElementById('email');
                const phone = document.getElementById('phone');
                const message = document.getElementById('message');

                if (!fullname || !email || !message) return;

                if (!fullname.value && !email.value && !message.value) {
                    fullname.value = 'Thapelo Manyama';
                    email.value = 'thapelo@example.co.za';
                    phone.value = '+27 82 123 4567';
                    message.value = 'Hi, I would like to enquire about catering for a small birthday celebration on 15 September. We are about 25 people. Please let me know your options and pricing. Thank you!';

                    const cateringRadio = document.getElementById('service_catering');
                    if (cateringRadio) cateringRadio.checked = true;

                    const charCounter = document.getElementById('charCounter');
                    if (charCounter) {
                        charCounter.textContent = message.value.length + ' / 800 characters';
                    }

                    [fullname, email, phone, message].forEach(function (el) {
                        el.classList.add('prefill-highlight');
                        setTimeout(function () { el.classList.remove('prefill-highlight'); }, 1500);
                    });
                }
            }
        });
    }

    /* ============================================================
       HOME PAGE (index.html)
    ============================================================ */

    if (isHomePage) {
        initHomePage();
    }

    function initHomePage() {
        // Scroll reveal animations
        initHomeScrollReveal();

        // Back to top button
        initHomeBackToTop();

        // Video playback
        initHomeVideo();

        // Smooth internal anchor scrolling
        initHomeSmoothAnchors();

        // Stat counter animation
        initHomeStatCounters();

        // Accordion
        initHomeAccordion();

        // Tabs
        initHomeTabs();

        // Modal
        initHomeModal();

        // Chatbot
        initHomeChatbot();
    }

    function initHomeScrollReveal() {
        const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
        if (!reveals.length) return;

        function checkReveal() {
            const windowHeight = window.innerHeight;
            const revealPoint = 120;

            reveals.forEach(el => {
                const revealTop = el.getBoundingClientRect().top;
                if (revealTop < windowHeight - revealPoint) {
                    el.classList.add('active');
                }
            });
        }

        window.addEventListener('load', checkReveal);
        window.addEventListener('scroll', debounce(checkReveal, 100), { passive: true });
        window.addEventListener('resize', debounce(checkReveal, 100));
        setTimeout(checkReveal, 200);
    }

    function initHomeBackToTop() {
        const toTopBtn = document.getElementById('toTopBtn');
        if (!toTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                toTopBtn.classList.add('show');
            } else {
                toTopBtn.classList.remove('show');
            }
        }, { passive: true });

        toTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initHomeVideo() {
        const video = document.querySelector('video');
        if (!video) return;

        video.addEventListener('click', function () {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        video.play().catch(e => {
            console.log("Autoplay prevented. User can click the video.");
        });
    }

    function initHomeSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function initHomeStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;

        function animateCount(el) {
            const target = parseInt(el.getAttribute('data-count'), 10);
            if (isNaN(target)) return;

            const duration = 1400;
            const startTime = performance.now();
            const isYear = target > 1000;

            function step(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);
                el.textContent = isYear ? value : value + '+';
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = isYear ? target : target + '+';
                }
            }

            requestAnimationFrame(step);
        }

        const statObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(n => statObserver.observe(n));
    }

    function initHomeAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        if (!accordionItems.length) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                accordionItems.forEach(i => {
                    i.classList.remove('open');
                    i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                });
                if (!isOpen) {
                    item.classList.add('open');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    function initHomeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        if (!tabButtons.length) return;

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-tab');

                tabButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                tabPanels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    function initHomeModal() {
        const modalOverlay = document.getElementById('videoModal');
        const openModalBtn = document.getElementById('openModalBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modalCloseBtn2 = document.getElementById('modalCloseBtn2');
        const modalPlayBtn = document.getElementById('modalPlayBtn');

        if (!modalOverlay) return;

        function openModal() {
            modalOverlay.classList.add('open');
            modalOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (closeModalBtn) closeModalBtn.focus();
        }

        function closeModal() {
            modalOverlay.classList.remove('open');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (openModalBtn) openModalBtn.focus();
        }

        if (openModalBtn) {
            openModalBtn.addEventListener('click', openModal);
            openModalBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal();
                }
            });
        }

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (modalCloseBtn2) modalCloseBtn2.addEventListener('click', closeModal);

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
                closeModal();
            }
        });

        if (modalPlayBtn) {
            modalPlayBtn.addEventListener('click', () => {
                closeModal();
                const videoSection = document.querySelector('.video-section');
                if (videoSection) {
                    videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const video = document.querySelector('video');
                    if (video) {
                        video.play().catch(() => {});
                    }
                }
            });
        }
    }

    function initHomeChatbot() {
        const chatLauncher = document.getElementById('chatLauncher');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose = document.getElementById('chatClose');
        const chatMessages = document.getElementById('chatMessages');
        const chatForm = document.getElementById('chatForm');
        const chatInput = document.getElementById('chatInput');
        const chatQuick = document.getElementById('chatQuick');

        if (!chatLauncher || !chatWindow) return;

        const knowledge = [
            {
                keywords: ['hour', 'open', 'close', 'time', 'trading'],
                reply: "We're open Mon–Fri from 6:30 to 17:00, and Saturday 7:00–14:00. We're closed on Sundays. Fresh bread comes out around 7am and again at midday!"
            },
            {
                keywords: ['where', 'location', 'address', 'find', 'directions', 'situated'],
                reply: "You'll find us at 12 Kerk Street, Mokopane, Limpopo — right in the heart of town, with parking out front. We're a two-minute walk from the main square. 📍"
            },
            {
                keywords: ['custom', 'cake', 'order', 'birthday', 'wedding', 'event'],
                reply: "Yes! We take custom cake and pastry orders — birthdays, weddings, corporate events and more. Please give us 48 hours' notice. Call +27 15 491 2345 or pop in to chat with our team. 🎂"
            },
            {
                keywords: ['bread', 'sourdough', 'loaf', 'rye', 'baguette', 'bake'],
                reply: "Our daily breads include 36-hour country sourdough, seeded rye, olive & rosemary fougasse, and classic baguette tradition. We also do seasonal specials — ask in-store! 🥖"
            },
            {
                keywords: ['deli', 'cheese', 'meat', 'charcuterie', 'sandwich', 'board'],
                reply: "Our deli counter is stocked with local artisan cheeses, cured meats (prosciutto, coppa, bresaola), house-made preserves, and gourmet made-to-order sandwiches. Build your own cheese board or let us guide you! 🧀"
            },
            {
                keywords: ['coffee', 'espresso', 'drink', 'tea', 'cappuccino'],
                reply: "We serve direct-trade coffee, roasted locally and brewed with care — espresso, flat white, cappuccino, filter and seasonal specials. Pair it with a warm croissant. ☕"
            },
            {
                keywords: ['pastry', 'croissant', 'dan', 'sweet', 'chocolate', 'pain'],
                reply: "Our pastry case is filled with hand-laminated butter croissants, pain au chocolat, almond danishes and seasonal fruit galettes — baked fresh through the morning. 🥐"
            },
            {
                keywords: ['vegan', 'gluten', 'allerg', 'diet', 'free'],
                reply: "We offer a small selection of vegan and gluten-friendly options, though our kitchen does handle wheat, dairy, eggs and nuts. Please ask our team about specific items — we're always happy to help! 🌾"
            },
            {
                keywords: ['delivery', 'online', 'ship', 'courier', 'order online'],
                reply: "At the moment we're a walk-in bakery — no online delivery just yet. For large orders or catering, please call us on +27 15 491 2345 and we'll arrange collection. 🚶"
            },
            {
                keywords: ['price', 'cost', 'how much', 'expensive'],
                reply: "Our sourdough loaves are around R55–R75, pastries from R28, and deli boards from R120. Custom cakes are quoted per design — just ask! "
            },
            {
                keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
                reply: "Hello and welcome to Mokopane Artisan Bakery & Deli! 🥖 How can I help — bread, pastries, deli, hours, or custom orders?"
            },
            {
                keywords: ['thank', 'thanks', 'cheers'],
                reply: "You're very welcome! Pop in soon — there's always something warm from the oven. "
            }
        ];

        const fallbackReplies = [
            "Great question! For the freshest answer, give us a ring on +27 15 491 2345 or pop into the bakery at 12 Kerk Street. 🥖",
            "I'm not 100% sure on that one — but our team would love to help. Call +27 15 491 2345 or ask in-store!",
            "That's a lovely question! Try asking about our breads, pastries, deli, hours or custom orders — or call us on +27 15 491 2345."
        ];

        let greeted = false;

        function addMessage(text, sender) {
            const div = document.createElement('div');
            div.className = 'msg ' + sender;
            div.textContent = text;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return div;
        }

        function showTyping() {
            const div = document.createElement('div');
            div.className = 'msg bot typing';
            div.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return div;
        }

        function getReply(userText) {
            const lower = userText.toLowerCase();
            for (const entry of knowledge) {
                if (entry.keywords.some(k => lower.includes(k))) {
                    return entry.reply;
                }
            }
            return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
        }

        function sendUserMessage(text) {
            const trimmed = text.trim();
            if (!trimmed) return;

            addMessage(trimmed, 'user');
            chatInput.value = '';

            const typingEl = showTyping();

            setTimeout(() => {
                typingEl.remove();
                const reply = getReply(trimmed);
                addMessage(reply, 'bot');
            }, 650 + Math.random() * 500);
        }

        function openChat() {
            chatWindow.classList.add('open');
            chatLauncher.style.display = 'none';

            if (!greeted) {
                greeted = true;
                setTimeout(() => {
                    addMessage("Hi there! 👋 I'm the Mokopane Bakery helper. Ask me about our breads, pastries, deli, opening hours, or custom orders — I'm here to help!", 'bot');
                }, 250);
            }
            setTimeout(() => chatInput.focus(), 400);
        }

        function closeChat() {
            chatWindow.classList.remove('open');
            chatLauncher.style.display = 'flex';
            chatLauncher.focus();
        }

        chatLauncher.addEventListener('click', openChat);
        chatClose.addEventListener('click', closeChat);

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendUserMessage(chatInput.value);
        });

        chatQuick.addEventListener('click', (e) => {
            const chip = e.target.closest('.quick-chip');
            if (chip) {
                sendUserMessage(chip.getAttribute('data-q'));
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatWindow.classList.contains('open')) {
                closeChat();
            }
        });

        console.log('%c Mokopane Artisan Bakery — fresh from the oven!', 'font-size:16px; font-weight:bold; color:#7a5233; background:#f5ede4; padding:8px 16px; border-radius:30px;');
    }

    /* ============================================================
       MENU PAGE (Menu.html)
    ============================================================ */

    if (isMenuPage) {
        initMenuPage();
    }

    function initMenuPage() {
        // Welcome animation
        initMenuWelcomeAnimation();

        // Trolley logic
        initMenuTrolley();

        // Chatbot
        initMenuChatbot();
    }

    function initMenuWelcomeAnimation() {
        const welcomeEl = document.querySelector('.welcome-animation');
        if (!welcomeEl) return;

        // The animation handles itself via CSS, but we ensure it's removed from DOM after completion
        setTimeout(() => {
            if (welcomeEl.parentNode) {
                welcomeEl.style.display = 'none';
            }
        }, 4500);
    }

    function initMenuTrolley() {
        let trolley = [];

        const trolleyItemsEl = document.getElementById('trolleyItems');
        const trolleyTotalEl = document.getElementById('trolleyTotal');
        const trolleyCountEl = document.getElementById('trolleyCount');
        const trolleySidebar = document.getElementById('trolleySidebar');
        const trolleyToggle = document.getElementById('trolleyToggle');
        const closeTrolley = document.getElementById('closeTrolley');
        const clearTrolleyBtn = document.getElementById('clearTrolleyBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!trolleyToggle || !trolleySidebar) return;

        function updateTrolleyUI() {
            const totalItems = trolley.reduce((sum, item) => sum + item.quantity, 0);
            if (trolleyCountEl) trolleyCountEl.textContent = totalItems;

            if (trolleyItemsEl) {
                if (trolley.length === 0) {
                    trolleyItemsEl.innerHTML = '<p style="color:#8a7a6a; font-size:0.9rem; text-align:center; margin-top:2rem;">Your trolley is empty.</p>';
                } else {
                    trolleyItemsEl.innerHTML = trolley.map((item, index) => `
                        <div class="trolley-item">
                            <div class="trolley-item-info">
                                <div class="trolley-item-name">${escapeHtml(item.name)}</div>
                                <div class="trolley-item-price">R ${item.price} each</div>
                            </div>
                            <div class="trolley-item-actions">
                                <button onclick="window.decreaseItem(${index})" aria-label="Decrease quantity">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="window.increaseItem(${index})" aria-label="Increase quantity">+</button>
                            </div>
                        </div>
                    `).join('');
                }
            }

            if (trolleyTotalEl) {
                const total = trolley.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                trolleyTotalEl.textContent = `R ${total}`;
            }
        }

        window.increaseItem = function (index) {
            trolley[index].quantity += 1;
            updateTrolleyUI();
        };

        window.decreaseItem = function (index) {
            if (trolley[index].quantity > 1) {
                trolley[index].quantity -= 1;
            } else {
                trolley.splice(index, 1);
            }
            updateTrolleyUI();
        };

        document.querySelectorAll('.add-to-trolley').forEach(btn => {
            btn.addEventListener('click', function () {
                const menuItem = this.closest('.menu-item');
                const name = menuItem.dataset.name;
                const price = parseFloat(menuItem.dataset.price);

                if (!name || isNaN(price)) return;

                const existing = trolley.find(item => item.name === name);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    trolley.push({ name, price, quantity: 1 });
                }
                updateTrolleyUI();

                // Feedback animation
                this.innerHTML = '<i class="fas fa-check"></i> Added';
                this.style.background = '#3f6b35';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-plus"></i> Add';
                    this.style.background = '#4d3827';
                }, 800);
            });
        });

        trolleyToggle.addEventListener('click', () => {
            trolleySidebar.classList.add('open');
        });

        if (closeTrolley) {
            closeTrolley.addEventListener('click', () => {
                trolleySidebar.classList.remove('open');
            });
        }

        if (clearTrolleyBtn) {
            clearTrolleyBtn.addEventListener('click', () => {
                if (trolley.length === 0) return;
                trolley = [];
                updateTrolleyUI();
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (trolley.length === 0) {
                    alert('Your trolley is empty. Add some delicious items first!');
                    return;
                }
                const total = trolley.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const itemsList = trolley.map(item => `• ${item.name} x${item.quantity} — R ${item.price * item.quantity}`).join('\n');
                alert(`Order Summary:\n\n${itemsList}\n\nTotal: R ${total}\n\nThank you! Your order will be ready shortly. (This is a demo.)`);
                trolley = [];
                updateTrolleyUI();
                trolleySidebar.classList.remove('open');
            });
        }

        updateTrolleyUI();
    }

    function initMenuChatbot() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotWindow = document.getElementById('chatbotWindow');
        const closeChat = document.getElementById('closeChat');
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const sendChat = document.getElementById('sendChat');

        if (!chatbotToggle || !chatbotWindow) return;

        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('open');
        });

        closeChat.addEventListener('click', () => {
            chatbotWindow.classList.remove('open');
        });

        function sendMessage() {
            const message = chatInput.value.trim();
            if (message === '') return;

            addMessage(message, 'user');
            chatInput.value = '';

            setTimeout(() => {
                const response = getChefResponse(message);
                addMessage(response, 'bot');
            }, 500);
        }

        sendChat.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        function addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-message', sender);
            if (sender === 'bot') {
                msgDiv.innerHTML = `<span class="chef-emoji">👨‍🍳</span> ${text}`;
            } else {
                msgDiv.textContent = text;
            }
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function getChefResponse(message) {
            const lower = message.toLowerCase();

            if (lower.includes('menu') || lower.includes('food') || lower.includes('eat') || lower.includes('recommend') || lower.includes('suggest')) {
                return "Ah, you've come to the right chef!  Our menu is full of handcrafted delights. We have fresh Bakery (sourdough, rye, ciabatta, baguette, brioche, multigrain), Pastries (croissants, pain au chocolat, cinnamon scrolls, danishes, scones), Deli Sandwiches (pastrami reuben, turkey & brie, caprese, smoked trout, roast beef, garden veggie), Salads & Bowls (grain bowl, caesar, cobb), and Beverages (coffee, tea). Just click 'Add' on anything that catches your eye, my lovely!";
            }
            if (lower.includes('sourdough')) {
                return "Our Sourdough Country Loaf is my pride and joy!  R48, with a 24-hour fermentation for a crisp crust and tangy crumb. You'll love it!";
            }
            if (lower.includes('croissant') || lower.includes('pastry') || lower.includes('pastries')) {
                return "Ah, pastries!  My personal weakness. The Almond Croissant (R42) is heavenly, and the Cinnamon Scroll (R36) is a customer favourite. Treat yourself, my lovely!";
            }
            if (lower.includes('sandwich') || lower.includes('deli')) {
                return "Our deli sandwiches are made on our artisan bread and served with a pickle & crisp. 🥪 My top picks: Pastrami Reuben (R95), Turkey & Brie (R88), and the Caprese Ciabatta (R78, vegetarian). Delicious!";
            }
            if (lower.includes('salad') || lower.includes('bowl') || lower.includes('healthy') || lower.includes('veg')) {
                return "Fresh and wholesome!  The Grain Bowl (R82, veg) is a lovely choice, as is the Classic Caesar (R76) and Smoked Chicken Cobb (R94). Perfect for a lighter bite!";
            }
            if (lower.includes('drink') || lower.includes('coffee') || lower.includes('tea') || lower.includes('beverage')) {
                return "A good meal deserves a good drink!  Our Flat White (R28) is silky smooth, and the Cappuccino (R30) is a classic. We also have Filter Coffee (R24) and English Breakfast Tea (R22).";
            }
            if (lower.includes('popular') || lower.includes('best') || lower.includes('favourite') || lower.includes('favorite')) {
                return "My personal favourites?  The Cinnamon Scroll and the Baguette are both marked 'popular' for good reason — our customers adore them! And the Pastrami Reuben is a deli classic. Try them all!";
            }
            if (lower.includes('hour') || lower.includes('open') || lower.includes('time') || lower.includes('close')) {
                return "We're open Monday to Saturday from 7:00 to 17:00, and Sunday from 8:00 to 14:00.  Come early for the freshest bakes!";
            }
            if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('find') || lower.includes('direction')) {
                return "You can find us at 123 Market , Mokopane.  Just follow the smell of fresh bread — you can't miss us!";
            }
            if (lower.includes('phone') || lower.includes('call') || lower.includes('contact') || lower.includes('email')) {
                return "You can reach us at 012 345 6789 or drop us a line at hello@mokopane.deli.  We'd love to hear from you!";
            }
            if (lower.includes('trolley') || lower.includes('cart') || lower.includes('order') || lower.includes('buy') || lower.includes('purchase') || lower.includes('checkout')) {
                return "To order, simply click the 'Add' button next to any item on the menu. 🛒 Your trolley will appear on the right. When you're ready, click 'Proceed to Checkout' to place your order. Easy as pie — and we make great pie! 😄";
            }
            if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('good day') || lower.includes('greetings')) {
                return "Hello, my lovely customer! 👋 Chef Mokopane at your service. What can I tempt you with today? Our sourdough is fresh out of the oven!";
            }
            if (lower.includes('how are you')) {
                return "I'm wonderful, thank you for asking! My ovens are hot and the bread is fresh.  How can I help you today?";
            }
            if (lower.includes('thank')) {
                return "You're very welcome, my lovely! Enjoy every bite and come back soon. 👨‍🍳";
            }
            if (lower.includes('bye') || lower.includes('goodbye') || lower.includes('see you')) {
                return "Goodbye, my lovely customer! Thanks for visiting Mokopane Artisan Bakery & Deli. See you soon — I'll have something special waiting! 👋";
            }
            if (lower.includes('love') || lower.includes('lovely')) {
                return "Aww, you're too kind!  I love what I do, and I love feeding lovely customers like you. Now, what can I get you?";
            }

            return "Hmm, I'm not quite sure about that, my lovely, but I'd be happy to help with our menu, opening hours, location, or how to order. Could you rephrase? ";
        }
    }

    /* ============================================================
       SERVICES PAGE (Services.html)
    ============================================================ */

    if (isServicesPage) {
        initServicesPage();
    }

    function initServicesPage() {
        // Tab system
        initServicesTabs();

        // Order & track logic
        initServicesOrderTracking();

        // Chatbot
        initServicesChatbot();

        // Service card highlights
        initServicesCardHighlights();
    }

    function initServicesTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        if (!tabButtons.length) return;

        function switchTab(tabName) {
            tabButtons.forEach(btn => {
                const isActive = btn.dataset.tab === tabName;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
            tabPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === `tab-${tabName}`);
            });
        }

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });

        // Expose switchTab globally for chatbot
        window.switchServicesTab = switchTab;
    }

    function initServicesOrderTracking() {
        const ordersStore = {};
        const transactions = [];

        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const trackOrderBtn = document.getElementById('trackOrderBtn');
        const trackResult = document.getElementById('trackResult');
        const orderNameInput = document.getElementById('orderName');
        const orderItemSelect = document.getElementById('orderItem');
        const orderQtyInput = document.getElementById('orderQty');
        const trackOrderIdInput = document.getElementById('trackOrderId');
        const transactionHistoryDiv = document.getElementById('transactionHistory');

        if (!placeOrderBtn) return;

        function renderTransactionHistory() {
            if (!transactionHistoryDiv) return;
            if (transactions.length === 0) {
                transactionHistoryDiv.innerHTML = '<div class="empty-tx">No transactions yet.</div>';
                return;
            }
            let html = '';
            transactions.slice().reverse().forEach(tx => {
                html += `<div class="tx-row">
                    <span class="tx-id">${tx.id}</span>
                    <span class="tx-amount">${tx.amount}</span>
                </div>`;
            });
            transactionHistoryDiv.innerHTML = html;
        }

        function getOrderStatus(order) {
            const elapsed = (Date.now() - order.createdAt) / 1000;
            if (elapsed < 10) {
                return { status: 'preparing', label: 'Preparing', className: 'preparing' };
            } else if (elapsed < 25) {
                return { status: 'ready', label: 'Ready for pickup', className: 'ready' };
            } else {
                return { status: 'out-for-delivery', label: 'Out for delivery', className: 'out-for-delivery' };
            }
        }

        function handlePlaceOrder() {
            const name = orderNameInput.value.trim();
            const item = orderItemSelect.value;
            const qty = parseInt(orderQtyInput.value, 10) || 1;

            if (!name) {
                showToast('⚠️ Please enter your name.');
                orderNameInput.focus();
                return;
            }

            if (qty < 1 || qty > 20) {
                showToast('⚠️ Quantity must be between 1 and 20.');
                orderQtyInput.focus();
                return;
            }

            const priceMap = {
                "Sourdough Loaf": 45,
                "Croissant (2)": 35,
                "Muffin (4)": 50,
                "Cappuccino": 28,
                "Breakfast Platter": 85,
                "Custom Cake": 250,
                "Brioche Loaf": 55,
                "Almond Croissant": 24,
                "Garden Salad": 65,
                "Chicken Mayo Sandwich": 48
            };
            const price = priceMap[item] || 30;
            const total = price * qty;

            const orderId = generateOrderId('MKP');
            const order = {
                id: orderId,
                name: name,
                item: item,
                qty: qty,
                total: total,
                createdAt: Date.now()
            };

            ordersStore[orderId] = order;

            transactions.push({
                id: orderId,
                amount: `R ${total.toFixed(2)}`
            });
            renderTransactionHistory();

            showToast(`✅ Order ${orderId} placed successfully!`, 3500);

            if (orderNameInput) orderNameInput.value = '';
            if (orderQtyInput) orderQtyInput.value = '1';
            if (trackOrderIdInput) trackOrderIdInput.value = orderId;
        }

        function handleTrackOrder() {
            const enteredId = trackOrderIdInput.value.trim().toUpperCase();

            if (!enteredId) {
                showToast('⚠️ Please enter an order ID.');
                if (trackResult) {
                    trackResult.textContent = '';
                    trackResult.classList.remove('show');
                }
                return;
            }

            const order = ordersStore[enteredId];

            if (!order) {
                if (trackResult) {
                    trackResult.innerHTML = `
                        <strong>Order not found.</strong> Please check your order ID and try again.<br>
                        <span style="font-size:0.85rem; color:#7a5d3e;">Tip: place an order first to receive an ID.</span>
                    `;
                    trackResult.classList.add('show');
                }
                return;
            }

            const status = getOrderStatus(order);

            if (trackResult) {
                trackResult.innerHTML = `
                    <strong>Order ${order.id}</strong><br>
                    ${order.qty} × ${order.item} for ${order.name}<br>
                    Total: R ${order.total.toFixed(2)}<br>
                    Status: <span class="status-badge ${status.className}">${status.label}</span>
                `;
                trackResult.classList.add('show');
            }
            showToast(` ${order.id}: ${status.label}`);
        }

        placeOrderBtn.addEventListener('click', handlePlaceOrder);

        if (trackOrderBtn) {
            trackOrderBtn.addEventListener('click', handleTrackOrder);
        }

        if (trackOrderIdInput) {
            trackOrderIdInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTrackOrder();
                }
            });
        }

        renderTransactionHistory();
    }

    function initServicesCardHighlights() {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('button')) return;
                const serviceKey = card.dataset.service;
                if (serviceKey) {
                    highlightServiceCard(serviceKey);
                }
            });
        });
    }

    function highlightServiceCard(serviceKey) {
        const services = {
            bakery: { name: "Fresh Artisan Bakery", cardId: "card-bakery" },
            coffee: { name: "Coffee & Beverages", cardId: "card-coffee" },
            deli: { name: "Deli & Fresh Meals", cardId: "card-deli" },
            cakes: { name: "Cakes & Special Orders", cardId: "card-cakes" },
            breakfast: { name: "Breakfast & Light Bites", cardId: "card-breakfast" }
        };

        const service = services[serviceKey];
        if (!service) return;

        // Ensure we're on the services tab
        if (typeof window.switchServicesTab === 'function') {
            window.switchServicesTab('services');
        }

        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('highlight');
        });

        const card = document.getElementById(service.cardId);
        if (card) {
            card.classList.add('highlight');
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);

            clearTimeout(card._highlightTimeout);
            card._highlightTimeout = setTimeout(() => {
                card.classList.remove('highlight');
            }, 2500);

            showToast(` ${service.name}`);
        }
    }

    function initServicesChatbot() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotContainer = document.getElementById('chatbotContainer');
        const chatbotClose = document.getElementById('chatbotClose');
        const chatbotMessages = document.getElementById('chatbotMessages');
        const chatbotOptions = document.getElementById('chatbotOptions');
        const chatbotInput = document.getElementById('chatbotInput');
        const chatbotSend = document.getElementById('chatbotSend');

        if (!chatbotToggle || !chatbotContainer) return;

        const services = {
            bakery: { name: "Fresh Artisan Bakery", description: "Freshly baked bread, rolls, croissants, muffins, and pastries daily.", cardId: "card-bakery" },
            coffee: { name: "Coffee & Beverages", description: "Expertly brewed coffee and refreshing beverages to pair with your pastry.", cardId: "card-coffee" },
            deli: { name: "Deli & Fresh Meals", description: "Fresh sandwiches, salads, savoury dishes, and deli favourites.", cardId: "card-deli" },
            cakes: { name: "Cakes & Special Orders", description: "Custom cakes, pastries, and baked goods for any occasion.", cardId: "card-cakes" },
            breakfast: { name: "Breakfast & Light Bites", description: "Hearty breakfast options and light meals made with care.", cardId: "card-breakfast" }
        };

        const botReplies = {
            greeting: "Hello!  Welcome to Mokopane Artisan Bakery & Deli. How can I help you today?",
            hours: "We're open Monday to Saturday from 7:00 AM to 6:00 PM, and Sunday from 8:00 AM to 2:00 PM. ",
            location: "We're located at 12 Main Road, Mokopane. Pop in for a visit! ",
            order: "You can place orders by calling us at (015) 123-4567 or by visiting our store. For custom cakes, please give us 48 hours notice.  You can also use the order form on this page!",
            track: "To track your order, enter your order ID in the 'Track Your Order' section. You'll receive an ID after placing an order. ",
            thanks: "You're very welcome! Is there anything else I can help you with? ",
            fallback: "I'm not sure I understand. You can ask about our services, opening hours, location, how to order, or how to track your order. You can also tap one of the quick options below."
        };

        function addMessage(text, sender = 'bot') {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('msg', sender);
            msgDiv.textContent = text;
            chatbotMessages.appendChild(msgDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function getBotReply(input) {
            const lower = input.toLowerCase().trim();

            if (/(hello|hi|hey|good\s*(morning|afternoon|evening)|howzit|hiya)/i.test(lower)) {
                return botReplies.greeting;
            }
            if (/(hour|open|close|time|when.*open|operating)/i.test(lower)) {
                return botReplies.hours;
            }
            if (/(where|location|address|find|directions|situated)/i.test(lower)) {
                return botReplies.location;
            }
            if (/(track|status|where.*order|order.*status)/i.test(lower)) {
                return botReplies.track;
            }
            if (/(order|buy|purchase|price|cost|how much|delivery)/i.test(lower)) {
                return botReplies.order;
            }
            if (/(thank|thanks|cheers|appreciate)/i.test(lower)) {
                return botReplies.thanks;
            }

            if (/(bakery|bread|rolls|croissant|muffin|pastr)/i.test(lower)) {
                highlightServiceCard('bakery');
                return `Our Fresh Artisan Bakery offers ${services.bakery.description} Would you like to know more?`;
            }
            if (/(coffee|beverage|drink|tea|cappuccino|latte|espresso)/i.test(lower)) {
                highlightServiceCard('coffee');
                return `Our Coffee & Beverages selection includes ${services.coffee.description} Perfect for a morning treat!`;
            }
            if (/(deli|sandwich|salad|savoury|meal|lunch)/i.test(lower)) {
                highlightServiceCard('deli');
                return `Our Deli & Fresh Meals feature ${services.deli.description} Freshly made daily.`;
            }
            if (/(cake|special order|celebration|birthday|wedding|custom)/i.test(lower)) {
                highlightServiceCard('cakes');
                return `We create beautiful custom cakes and baked goods for any occasion. ${services.cakes.description}`;
            }
            if (/(breakfast|light bite|morning|brunch)/i.test(lower)) {
                highlightServiceCard('breakfast');
                return `Start your day right with our Breakfast & Light Bites: ${services.breakfast.description}`;
            }

            return botReplies.fallback;
        }

        function handleUserMessage() {
            const text = chatbotInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            chatbotInput.value = '';
            chatbotInput.focus();

            setTimeout(() => {
                const reply = getBotReply(text);
                addMessage(reply, 'bot');
            }, 400);
        }

        function renderChatbotOptions() {
            const options = [
                { label: ' Opening Hours', action: 'hours' },
                { label: ' Location', action: 'location' },
                { label: 'How to Order', action: 'order' },
                { label: ' Track Order', action: 'track' },
                { label: ' Our Services', action: 'services' },
                { label: ' Greeting', action: 'greeting' }
            ];

            chatbotOptions.innerHTML = '';

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.textContent = opt.label;
                btn.addEventListener('click', () => {
                    if (opt.action === 'services') {
                        addMessage('Here are our services:', 'bot');
                        if (typeof window.switchServicesTab === 'function') {
                            window.switchServicesTab('services');
                        }
                        Object.keys(services).forEach((key, index) => {
                            setTimeout(() => {
                                const s = services[key];
                                addMessage(`✦ ${s.name} — ${s.description}`, 'bot');
                                highlightServiceCard(key);
                            }, index * 300);
                        });
                    } else if (opt.action === 'order') {
                        if (typeof window.switchServicesTab === 'function') {
                            window.switchServicesTab('order');
                        }
                        addMessage(botReplies.order, 'bot');
                    } else if (opt.action === 'track') {
                        if (typeof window.switchServicesTab === 'function') {
                            window.switchServicesTab('order');
                        }
                        addMessage(botReplies.track, 'bot');
                    } else {
                        const userMsg = opt.label.replace(/[^\w\s]/g, '').trim();
                        addMessage(userMsg, 'user');
                        setTimeout(() => {
                            const reply = getBotReply(opt.action);
                            addMessage(reply, 'bot');
                        }, 300);
                    }
                });
                chatbotOptions.appendChild(btn);
            });
        }

        function initChatbot() {
            chatbotMessages.innerHTML = '';
            addMessage("Hello!  I'm the Mokopane assistant. How can I help you today?", 'bot');
            renderChatbotOptions();
        }

        chatbotToggle.addEventListener('click', () => {
            const isOpen = chatbotContainer.classList.contains('open');
            if (isOpen) {
                chatbotContainer.classList.remove('open');
            } else {
                chatbotContainer.classList.add('open');
                if (chatbotMessages.children.length === 0) {
                    initChatbot();
                }
                chatbotInput.focus();
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotContainer.classList.remove('open');
        });

        chatbotSend.addEventListener('click', handleUserMessage);
        chatbotInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUserMessage();
            }
        });

        // Show helpful toast after welcome animation
        setTimeout(() => {
            showToast(' Tap the chat button or use the tabs to explore our services, prices, and ordering!', 4500);
        }, 3800);
    }

})();