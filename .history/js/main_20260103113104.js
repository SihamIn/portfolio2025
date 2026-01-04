(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Typed Initiate
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }


    // Smooth scrolling to section
    $(".btn-scroll, .nav-link:not(.dropdown-toggle), .dropdown-item").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 60
            }, 1500, 'easeInOutExpo');

            // Close mobile menu after navigation
            if ($(window).width() <= 576) {
                $('.header-nav').removeClass('is-open');
                $('.menu-toggle').attr('aria-expanded', 'false');
            }
        }
    });

    // Mobile burger menu toggle
    $('.menu-toggle').attr('aria-expanded', 'false');
    $('.menu-toggle').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.header-nav').toggleClass('is-open');
        $(this).attr('aria-expanded', $('.header-nav').hasClass('is-open') ? 'true' : 'false');
    });
    
    // Close mobile menu when clicking outside
    $(document).on('click', function (e) {
        if ($(window).width() <= 576 && $('.header-nav').hasClass('is-open')) {
            if (!$(e.target).closest('.header-container').length) {
                $('.header-nav').removeClass('is-open');
                $('.menu-toggle').attr('aria-expanded', 'false');
            }
        }
    });
    
    // Close on ESC
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('.header-nav').hasClass('is-open')) {
            $('.header-nav').removeClass('is-open');
            $('.menu-toggle').attr('aria-expanded', 'false');
        }
    });
    
    
    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
    // Portfolio video modal (mp4)
    $(document).on('click', '.portfolio-video', function (e) {
        e.preventDefault();
        var src = $(this).data('video-src');
        var title = $(this).data('video-title') || 'Video';
        
        $('#portfolioVideoTitle').text(title);
        var $player = $('#portfolioVideoPlayer');
        $player.attr('src', src);
        
        $('#portfolioVideoModal').modal('show');
        
        // Try autoplay after modal is visible
        setTimeout(function () {
            var el = $player.get(0);
            if (el) {
                el.play().catch(function () {});
            }
        }, 200);
    });
    
    $('#portfolioVideoModal').on('hidden.bs.modal', function () {
        var $player = $('#portfolioVideoPlayer');
        var el = $player.get(0);
        if (el) {
            el.pause();
            el.currentTime = 0;
        }
        $player.removeAttr('src');
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        items: 1
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    // Dropdown menu toggle
    $('.dropdown-toggle').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $dropdown = $(this).closest('.nav-dropdown');
        $('.nav-dropdown').not($dropdown).removeClass('active');
        $dropdown.toggleClass('active');
    });
    
    // Close dropdown when clicking on dropdown item (except language items)
    $('.dropdown-item').on('click', function (e) {
        if (!$(this).hasClass('language-item')) {
        $('.nav-dropdown').removeClass('active');
        }
    });
    
    // Close dropdown when clicking outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.nav-dropdown').length) {
            $('.nav-dropdown').removeClass('active');
        }
    });
    
    // Translation system
    var currentLang = localStorage.getItem('language') || 'fr';
    
    function changeLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Wait for translations to be loaded
        if (typeof translations === 'undefined') {
            console.error('Translations not loaded, retrying...');
            setTimeout(function() {
                changeLanguage(lang);
            }, 100);
            return;
        }
        
        var t = translations[lang];
        if (!t) {
            console.error('Translation for language ' + lang + ' not found');
            return;
        }
        
        console.log('Changing language to:', lang, 'Translations available:', !!t);
        
        // Navigation
        $('[data-i18n="nav.home"]').text(t.nav.home);
        $('[data-i18n="nav.about"]').text(t.nav.about);
        $('[data-i18n="nav.competences"]').text(t.nav.competences);
        $('[data-i18n="nav.formation"]').text(t.nav.formation);
        $('[data-i18n="nav.portfolio"]').text(t.nav.portfolio);
        $('[data-i18n="nav.experience"]').text(t.nav.experience);
        $('[data-i18n="nav.contact"]').text(t.nav.contact);
        
        // Hero section
        $('[data-i18n="hero.title"]').text(t.hero.title);
        $('[data-i18n="hero.subtitle"]').text(t.hero.subtitle);
        $('[data-i18n="hero.downloadCV"]').text(t.hero.downloadCV);
        $('[data-i18n="hero.pageIndicator"]').text(t.hero.pageIndicator);
        
        // About section
        $('[data-i18n="about.title"]').text(t.about.title);
        $('[data-i18n="about.greeting"]').text(t.about.greeting);
        $('[data-i18n="about.description1"]').text(t.about.description1);
        $('[data-i18n="about.description2"]').html(t.about.description2 + ' <a href="https://marketplace.soluxuryhospitality.io/connect" target="_blank">Soluxury Hospitality</a>');
        $('[data-i18n="about.name"]').text(t.about.name);
        $('[data-i18n="about.education"]').text(t.about.education);
        $('[data-i18n="about.specialization"]').text(t.about.specialization);
        $('[data-i18n="about.position"]').text(t.about.position);
        $('[data-i18n="about.phone"]').text(t.about.phone);
        $('[data-i18n="about.email"]').text(t.about.email);
        $('[data-i18n="about.stages"]').text(t.about.stages);
        $('[data-i18n="about.experience"]').text(t.about.experience);
        $('[data-i18n="about.total"]').text(t.about.total);
        $('[data-i18n="about.certificates"]').text(t.about.certificates);
        $('[data-i18n="about.projects"]').text(t.about.projects);
        $('[data-i18n="about.freelancePrefix"]').text(t.about.freelancePrefix);
        $('[data-i18n="about.works"]').text(t.about.works);
        
        // Competences
        $('[data-i18n="competences.title"]').text(t.competences.title);
        $('[data-i18n="competences.languagesTech"]').text('• ' + t.competences.languagesTech);
        $('[data-i18n="competences.frameworks"]').text('• ' + t.competences.frameworks);
        $('[data-i18n="competences.tools"]').text('• ' + t.competences.tools);
        $('[data-i18n="competences.designAi"]').text('• ' + t.competences.designAi);
        $('[data-i18n="competences.databases"]').text('• ' + t.competences.databases);
        $('[data-i18n="competences.networks"]').text('• ' + t.competences.networks);
        
        // Formation
        $('[data-i18n="formation.title"]').text(t.formation.title);
        $('[data-i18n="formation.certificates"]').text(t.formation.certificates);
        $('[data-i18n="formation.diploma1"]').text(t.formation.diploma1);
        $('[data-i18n="formation.diploma2"]').text(t.formation.diploma2);
        $('[data-i18n="formation.diploma3"]').text(t.formation.diploma3);
        $('[data-i18n="formation.cert1"]').text(t.formation.cert1);
        $('[data-i18n="formation.cert2"]').text(t.formation.cert2);
        
        // Portfolio
        $('[data-i18n="portfolio.title"]').text(t.portfolio.title);
        var $allBtn = $('[data-i18n="portfolio.all"]');
        var $designBtn = $('[data-i18n="portfolio.design"]');
        var $devBtn = $('[data-i18n="portfolio.development"]');
        if ($allBtn.length) {
            $allBtn.html('<i class="fa fa-star me-2"></i>' + t.portfolio.all);
        }
        if ($designBtn.length) {
            $designBtn.html('<i class="fa fa-laptop-code me-2"></i>' + t.portfolio.design);
        }
        if ($devBtn.length) {
            $devBtn.html('<i class="fa fa-mobile-alt me-2"></i>' + t.portfolio.development);
        }
        
        // Experience
        $('[data-i18n="experience.title"]').text(t.experience.title);
        $('[data-i18n="experience.exp1_title"]').text(t.experience.exp1_title);
        $('[data-i18n="experience.exp1_period"]').text(t.experience.exp1_period);
        $('[data-i18n="experience.exp1_desc"]').text(t.experience.exp1_desc);
        $('[data-i18n="experience.exp1_desc2"]').text(t.experience.exp1_desc2);
        $('[data-i18n="experience.exp1_tech"]').text(t.experience.exp1_tech);
        $('[data-i18n="experience.exp1_role"]').text(t.experience.exp1_role);
        $('[data-i18n="experience.exp2_title"]').text(t.experience.exp2_title);
        $('[data-i18n="experience.exp2_period"]').text(t.experience.exp2_period);
        $('[data-i18n="experience.exp2_desc"]').text(t.experience.exp2_desc);
        $('[data-i18n="experience.exp2_desc2"]').text(t.experience.exp2_desc2);
        $('[data-i18n="experience.exp2_tech"]').text(t.experience.exp2_tech);
        $('[data-i18n="experience.exp2_role"]').text(t.experience.exp2_role);
        $('[data-i18n="experience.exp3_title"]').text(t.experience.exp3_title);
        $('[data-i18n="experience.exp3_period"]').text(t.experience.exp3_period);
        $('[data-i18n="experience.exp3_desc"]').text(t.experience.exp3_desc);
        $('[data-i18n="experience.exp3_desc2"]').text(t.experience.exp3_desc2);
        $('[data-i18n="experience.exp3_desc3"]').text(t.experience.exp3_desc3);
        $('[data-i18n="experience.exp3_desc4"]').text(t.experience.exp3_desc4);
        $('[data-i18n="experience.exp4_title"]').text(t.experience.exp4_title);
        $('[data-i18n="experience.exp4_period"]').text(t.experience.exp4_period);
        $('[data-i18n="experience.exp4_desc"]').text(t.experience.exp4_desc);
        $('[data-i18n="experience.exp4_desc2"]').text(t.experience.exp4_desc2);
        $('[data-i18n="experience.exp4_desc3"]').text(t.experience.exp4_desc3);
        $('[data-i18n="experience.exp4_desc4"]').text(t.experience.exp4_desc4);
        $('[data-i18n="experience.exp5_title"]').text(t.experience.exp5_title);
        $('[data-i18n="experience.exp5_period"]').text(t.experience.exp5_period);
        $('[data-i18n="experience.exp5_desc"]').text(t.experience.exp5_desc);
        $('[data-i18n="experience.exp5_desc2"]').text(t.experience.exp5_desc2);
        $('[data-i18n="experience.exp5_desc3"]').text(t.experience.exp5_desc3);
        $('[data-i18n="experience.exp5_desc4"]').text(t.experience.exp5_desc4);
        $('[data-i18n="experience.link"]').text(t.experience.link);
        $('[data-i18n="experience.link_text"]').text(t.experience.link_text);
        
        // Contact
        $('[data-i18n="contact.title"]').text(t.contact.title);
        $('[data-i18n="contact.contactMe"]').text(t.contact.contactMe);
        $('[data-i18n="contact.email"]').text(t.contact.email);
        $('[data-i18n="contact.tel"]').text(t.contact.tel);
        $('[data-i18n="contact.address"]').text(t.contact.address);
        $('[data-i18n="contact.whatsapp"]').text(t.contact.whatsapp);
        $('[data-i18n="contact.name"]').html(t.contact.name + ' <span class="text-danger">*</span>');
        $('[data-i18n="contact.subject"]').text(t.contact.subject);
        $('[data-i18n="contact.message"]').html(t.contact.message + ' <span class="text-danger">*</span>');
        $('[data-i18n="contact.send"]').text(t.contact.send);
        
        // Footer
        $('[data-i18n="footer.privacy"]').text(t.footer.privacy);
        $('[data-i18n="footer.terms"]').text(t.footer.terms);
        $('[data-i18n="footer.faqs"]').text(t.footer.faqs);
        $('[data-i18n="footer.help"]').text(t.footer.help);
        $('[data-i18n="footer.rights"]').text(t.footer.rights);
        
        // Common
        $('#testLangBtn').attr('title', t.common.changeLanguage);
        $('.whatsapp-link, .whatsapp-float').attr('title', t.common.contactWhatsApp);
        
        // Update flag and text in button
        var text = lang === 'fr' ? 'FR' : 'EN';
        var $btn = $('#testLangBtn');
        if ($btn.length) {
            var $flagSpan = $btn.find('.current-language');
            var flagSvg = lang === 'fr' 
                ? '<svg class="flag-svg" viewBox="0 0 640 480" width="20" height="15"><g fill-rule="evenodd" stroke-width="1pt"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#00267f" d="M0 0h213.3v480H0z"/><path fill="#f31830" d="M426.7 0H640v480H426.7z"/></g></svg>'
                : '<svg class="flag-svg" viewBox="0 0 640 480" width="20" height="15"><defs><clipPath id="a"><path fill-opacity=".7" d="M-85.3 0h682.6v512h-682.6z"/></clipPath></defs><g clip-path="url(#a)" transform="translate(80) scale(.94)"><g stroke-width="1pt"><path fill="#006" d="M-256 0H768v512H-256z"/><path fill="#fff" d="M-256 0v57.2l653.8 454.8H768v-454.8H-256zM768 0v57.2L114.2 512H-256V0h1024z" fill-rule="evenodd"/><path fill="#fff" d="M170.6 0v512h170.6V0H170.6zM-256 170.6v170.6H768V170.6H-256z" fill-rule="evenodd"/><path fill="#c00" d="M-256 204.8v102.4H768V204.8H-256zM204.8 0v512h102.4V0H204.8zM-256 512L85.3 341.3h76.4L-179.7 512H-256zm0-512L85.3 170.7H9L-256 38.2V0zm606.4 170.7L768 0h76.8L522.2 170.7h-76.8zm0 170.6L768 512h76.8L522.2 341.3h-76.8z" fill-rule="evenodd"/></g></g></svg>';
            $flagSpan.html(flagSvg).css({
                'visibility': 'visible',
                'opacity': '1',
                'display': 'inline-flex'
            });
            $btn.find('.language-text').text(text);
        }
        
        // Update HTML lang attribute
        $('html').attr('lang', lang);
    }
    
    // Initialize language on page load - wait for DOM and translations
    function initLanguage() {
        if (typeof translations !== 'undefined' && translations[currentLang]) {
            console.log('Initializing language:', currentLang);
            changeLanguage(currentLang);
        } else {
            console.warn('Translations not loaded yet, retrying...');
            setTimeout(initLanguage, 100);
        }
    }
    
    // Start initialization after a short delay to ensure scripts are loaded
    setTimeout(initLanguage, 300);
    
    // Language test button in menu - use event delegation
    $(document).on('click', '#testLangBtn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var currentLang = localStorage.getItem('language') || 'fr';
        var newLang = currentLang === 'fr' ? 'en' : 'fr';
        
        console.log('Language button clicked, changing from', currentLang, 'to', newLang);
        
        changeLanguage(newLang);
        
        // Update button display
        var text = newLang === 'fr' ? 'FR' : 'EN';
        var $btn = $('#testLangBtn');
        if ($btn.length) {
            var $flagSpan = $btn.find('.current-language');
            var flagSvg = newLang === 'fr' 
                ? '<svg class="flag-svg" viewBox="0 0 640 480" width="20" height="15"><g fill-rule="evenodd" stroke-width="1pt"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#00267f" d="M0 0h213.3v480H0z"/><path fill="#f31830" d="M426.7 0H640v480H426.7z"/></g></svg>'
                : '<svg class="flag-svg" viewBox="0 0 640 480" width="20" height="15"><defs><clipPath id="a"><path fill-opacity=".7" d="M-85.3 0h682.6v512h-682.6z"/></clipPath></defs><g clip-path="url(#a)" transform="translate(80) scale(.94)"><g stroke-width="1pt"><path fill="#006" d="M-256 0H768v512H-256z"/><path fill="#fff" d="M-256 0v57.2l653.8 454.8H768v-454.8H-256zM768 0v57.2L114.2 512H-256V0h1024z" fill-rule="evenodd"/><path fill="#fff" d="M170.6 0v512h170.6V0H170.6zM-256 170.6v170.6H768V170.6H-256z" fill-rule="evenodd"/><path fill="#c00" d="M-256 204.8v102.4H768V204.8H-256zM204.8 0v512h102.4V0H204.8zM-256 512L85.3 341.3h76.4L-179.7 512H-256zm0-512L85.3 170.7H9L-256 38.2V0zm606.4 170.7L768 0h76.8L522.2 170.7h-76.8zm0 170.6L768 512h76.8L522.2 341.3h-76.8z" fill-rule="evenodd"/></g></g></svg>';
            $flagSpan.html(flagSvg).css({
                'display': 'inline-flex',
                'visibility': 'visible',
                'opacity': '1'
            });
            $btn.find('.language-text').text(text);
        }
    });
    
})(jQuery);

