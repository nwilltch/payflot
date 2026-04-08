// Waitlist Form Handling - VERSION AVEC BACKEND
document.addEventListener('DOMContentLoaded', function() {
    const waitlistForm = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');
    
    // URL de ton backend (À MODIFIER APRÈS DÉPLOIEMENT)
    const BACKEND_URL = 'https://TON-BACKEND-URL.railway.app'; // ← CHANGE MOI !
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const userType = document.getElementById('userType').value;
            
            // Simple validation
            if (!email || !userType) {
                alert('Please fill in all fields');
                return;
            }
            
            // Désactiver le bouton pendant l'envoi
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Essayer d'envoyer au backend
                const response = await fetch(`${BACKEND_URL}/api/waitlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, userType })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    console.log('✅ Email envoyé au backend:', data);
                    // Afficher message de succès
                    waitlistForm.style.display = 'none';
                    successMessage.style.display = 'flex';
                    successMessage.innerHTML = `<i class="fas fa-check-circle"></i> Merci ! Tu es inscrit(e) à la waitlist. (${data.total} personnes déjà inscrites)`;
                } else {
                    throw new Error(data.error || 'Erreur serveur');
                }
                
            } catch (error) {
                console.error('❌ Erreur backend, fallback à console:', error);
                
                // Fallback: log dans console si backend down
                console.log('📧 PayFlot Waitlist (fallback):', { email, userType });
                
                // Afficher message de succès quand même
                waitlistForm.style.display = 'none';
                successMessage.style.display = 'flex';
                successMessage.innerHTML = `<i class="fas fa-check-circle"></i> Merci ! Ton email a été enregistré. (Backend temporairement indisponible)`;
                
                // Option: envoyer un email de secours (très basique)
                sendFallbackEmail(email, userType);
            } finally {
                // Réactiver le bouton
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Reset form
                waitlistForm.reset();
            }
        });
    }
    
    // Fonction de secours très basique
    function sendFallbackEmail(email, userType) {
        // Ici tu pourrais envoyer un email à toi-même via Formspree ou autre
        // Pour l'instant, juste un log
        console.log(`📨 Fallback email à envoyer manuellement: ${email} (${userType})`);
        
        // Option: ouvrir ton client email avec pré-remplissage
        const subject = encodeURIComponent('Nouvelle inscription PayFlot Waitlist');
        const body = encodeURIComponent(`Email: ${email}\nType: ${userType}\nDate: ${new Date().toLocaleString()}`);
        // window.open(`mailto:hello@payflot.com?subject=${subject}&body=${body}`);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate stats counter (optional enhancement)
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    };
    
    // Animate hero stats when they come into view
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    if (!isNaN(target)) {
                        animateCounter(stat, target);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
    
    // Add hover effects to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            pricingCards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.7';
                    c.style.transform = 'scale(0.95)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            pricingCards.forEach(c => {
                c.style.opacity = '1';
                c.style.transform = 'scale(1)';
            });
        });
    });
    
    // Update waitlist count (simulated)
    function updateWaitlistCount() {
        const countElement = document.querySelector('.cta p');
        if (countElement) {
            // Simulate growing waitlist
            const baseCount = 500;
            const randomIncrement = Math.floor(Math.random() * 10);
            const totalCount = baseCount + randomIncrement;
            countElement.textContent = `Join ${totalCount}+ freelancers and small businesses on our waitlist.`;
        }
    }
    
    // Update count every 30 seconds (for demo purposes)
    setInterval(updateWaitlistCount, 30000);
    
    // Initialize
    updateWaitlistCount();
});

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Local storage for form persistence (optional)
function saveFormData() {
    const email = document.getElementById('email').value;
    const userType = document.getElementById('userType').value;
    
    if (email) {
        localStorage.setItem('payflot_waitlist_email', email);
    }
    if (userType) {
        localStorage.setItem('payflot_waitlist_userType', userType);
    }
}

function loadFormData() {
    const savedEmail = localStorage.getItem('payflot_waitlist_email');
    const savedUserType = localStorage.getItem('payflot_waitlist_userType');
    
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }
    if (savedUserType) {
        document.getElementById('userType').value = savedUserType;
    }
}

// Load saved form data on page load
window.addEventListener('load', loadFormData);

// Save form data on change
document.getElementById('email')?.addEventListener('input', saveFormData);
document.getElementById('userType')?.addEventListener('change', saveFormData);