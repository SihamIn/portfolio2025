(function ($) {
    "use strict";

    var CONFIG = window.CONTACT_CONFIG || {};
    var EMAIL_TO = CONFIG.emailTo || 'sihamalilou89@gmail.com';
    var EMAILJS = (CONFIG.emailjs || {});
    var API = (CONFIG.api || {});
    var CONTACT_API_PATH = API.contactPath || '/api/contact';
    var FORMSUBMIT_ENABLED = !CONFIG.formsubmit || CONFIG.formsubmit.enabled !== false;

    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        
        var $form = $(this);
        var $submitBtn = $form.find('button[type="submit"]');
        var originalText = $submitBtn.html();
        
        var name = $('#name').val().trim();
        var email = $('#email').val().trim();
        var subject = $('#subject').val().trim();
        var message = $('#message').val().trim();
        var honey = ($('#_honey').val() || '').trim();

        if (honey) {
            showMessage('success', 'Message envoyé avec succès !');
            $form[0].reset();
            return;
        }
        
        if (!name || !email || !message) {
            showMessage('error', 'Veuillez remplir tous les champs obligatoires.');
            return;
        }
        
        if (!validateEmail(email)) {
            showMessage('error', 'Veuillez entrer une adresse email valide.');
            return;
        }
        
        $submitBtn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Envoi en cours...');
        
        // Méthode 1: EmailJS (optionnel)
        var templateParams = {
            from_name: name,
            from_email: email,
            subject: subject || 'Message depuis le portfolio',
            message: message,
            to_email: EMAIL_TO
        };
        
        // Méthode 0: API Vercel (recommandé sur Vercel)
        sendViaVercel(name, email, subject, message, $form, $submitBtn, originalText, function ok() {
            // sent
        }, function fail() {
            // fallback EmailJS -> mailto
            tryEmailJSOrMailto();
        });

        function tryEmailJSOrMailto() {
        var canUseEmailJS = typeof emailjs !== 'undefined'
            && EMAILJS.publicKey
            && EMAILJS.serviceId
            && EMAILJS.templateId;

        if (canUseEmailJS) {
            try {
                if (emailjs && typeof emailjs.init === 'function') {
                    emailjs.init(EMAILJS.publicKey);
                }
            } catch (e) {}

            emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, templateParams)
                .then(function(response) {
                    $form[0].reset();
                    showMessage('success', 'Message envoyé avec succès ! Vous recevrez une réponse bientôt.');
                    $submitBtn.prop('disabled', false).html(originalText);
                }, function(error) {
                    console.error('EmailJS Error:', error);
                    fallbackMailto(name, email, subject, message);
                });
        } else {
            fallbackMailto(name, email, subject, message);
        }
        }
    });
    
    function sendViaVercel(name, email, subject, message, $form, $submitBtn, originalText, onOk, onFail) {
        $.ajax({
            url: CONTACT_API_PATH,
            type: 'POST',
            data: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: message,
                _honey: ($('#_honey').val() || '').trim()
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response && response.success) {
                    $form[0].reset();
                    showMessage('success', response.message || 'Message envoyé avec succès !');
                    $submitBtn.prop('disabled', false).html(originalText);
                    if (onOk) onOk();
                } else {
                    if (onFail) onFail();
                }
            },
            error: function () {
                if (onFail) onFail();
            }
        });
    }

    function sendViaPHP(name, email, subject, message, $form, $submitBtn, originalText) {
        $.ajax({
            url: 'mail/contact.php',
            type: 'POST',
            data: {
                name: name,
                email: email,
                subject: subject,
                message: message
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    $form[0].reset();
                    showMessage('success', response.message || 'Message envoyé avec succès !');
                } else {
                    if (FORMSUBMIT_ENABLED) {
                        sendViaFormSubmit(name, email, subject, message, $form, $submitBtn, originalText);
                    } else {
                        showMessage('error', response.message || 'Erreur lors de l\'envoi du message.');
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('PHP Error:', xhr, status, error);
                if (FORMSUBMIT_ENABLED) {
                    sendViaFormSubmit(name, email, subject, message, $form, $submitBtn, originalText);
                } else {
                    fallbackMailto(name, email, subject, message);
                }
            },
            complete: function () {
                $submitBtn.prop('disabled', false).html(originalText);
            }
        });
    }

    function sendViaFormSubmit(name, email, subject, message, $form, $submitBtn, originalText) {
        $.ajax({
            url: 'https://formsubmit.co/ajax/' + encodeURIComponent(EMAIL_TO),
            type: 'POST',
            data: {
                name: name,
                email: email,
                subject: subject || 'Message depuis le portfolio',
                message: message,
                _subject: 'Portfolio - ' + (subject || 'Nouveau message'),
                _captcha: 'false',
                _template: 'table',
                _honey: ''
            },
            dataType: 'json',
            success: function () {
                $form[0].reset();
                showMessage('success', 'Message envoyé avec succès ! Vous recevrez une réponse bientôt.');
            },
            error: function (xhr, status, error) {
                console.error('FormSubmit Error:', xhr, status, error);
                fallbackMailto(name, email, subject, message);
            },
            complete: function () {
                $submitBtn.prop('disabled', false).html(originalText);
            }
        });
    }

    function fallbackMailto(name, email, subject, message) {
        var mailtoSubject = encodeURIComponent(subject || 'Message depuis le portfolio');
        var mailtoBody = encodeURIComponent('Nom: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
        var mailtoLink = 'mailto:' + EMAIL_TO + '?subject=' + mailtoSubject + '&body=' + mailtoBody;
        
        if (confirm('Impossible d\'envoyer automatiquement. Voulez-vous ouvrir votre client email pour envoyer le message ?')) {
            window.location.href = mailtoLink;
        } else {
            showMessage('error', 'Erreur de connexion. Vous pouvez me contacter directement à ' + EMAIL_TO);
        }
    }
    
    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showMessage(type, message) {
        var alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        var icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        var alertHtml = '<div class="alert ' + alertClass + ' alert-dismissible fade show" role="alert">' +
            '<i class="fa ' + icon + ' me-2"></i>' + message +
            '<button type="button" class="btn-close" onclick="$(this).parent().fadeOut(function(){$(this).remove();})" aria-label="Close"></button>' +
            '</div>';
        
        $('#contactForm').before(alertHtml);
        
        setTimeout(function () {
            $('.alert').fadeOut(function () {
                $(this).remove();
            });
        }, 5000);
        
        $('html, body').animate({
            scrollTop: $('#contactForm').offset().top - 100
        }, 500);
    }
})(jQuery);

