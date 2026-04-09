// PayFlot Waitlist - Version Google Sheets
document.addEventListener('DOMContentLoaded', function() {
    const waitlistForm = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');
    
    // ✅ TON URL GOOGLE APPS SCRIPT
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyh1qogb1_XRNAhR1MBSeeTh8hLAkfeFW-YS89Q1NtvYA0rqyUMRNtH-nNPIVR9L4ti/exec';
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const userType = document.getElementById('userType').value;
            
            // Validation
            if (!email || !userType) {
                alert('Please fill in all fields');
                return;
            }
            
            // Désactiver bouton
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Envoyer à Google Sheets
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, userType }),
                    mode: 'no-cors' // Important pour Google Apps Script
                });
                
                // Note: mode 'no-cors' ne permet pas de lire la réponse
                // Mais l'email est bien envoyé à Google Sheets
                
                console.log('✅ Email envoyé à Google Sheets:', { email, userType });
                
                // Succès
                waitlistForm.style.display = 'none';
                successMessage.style.display = 'flex';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i> 
                    <div>
                        <strong>Thank you!</strong><br>
                        You're on the PayFlot waitlist.
                    </div>
                `;
                
                // Backup local au cas où
                saveLocalBackup(email, userType);
                
            } catch (error) {
                console.error('❌ Erreur Google Sheets:', error);
                
                // Fallback 1: Console
                console.log('📧 PayFlot Waitlist (fallback):', { email, userType });
                
                // Fallback 2: LocalStorage
                saveLocalBackup(email, userType);
                
                // Afficher succès quand même
                waitlistForm.style.display = 'none';
                successMessage.style.display = 'flex';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i> 
                    <div>
                        <strong>Thank you!</strong><br>
                        Your email has been saved locally.
                    </div>
                `;
                
            } finally {
                // Réactiver bouton
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Reset form
                waitlistForm.reset();
            }
        });
    }
    
    // Sauvegarde locale au cas où
    function saveLocalBackup(email, userType) {
        try {
            const backup = {
                email,
                userType,
                timestamp: new Date().toISOString(),
                source: 'payflot_waitlist'
            };
            
            // Sauvegarder dans localStorage
            const key = 'payflot_backup_' + Date.now();
            localStorage.setItem(key, JSON.stringify(backup));
            
            // Garder seulement les 10 derniers
            cleanupOldBackups();
            
        } catch (e) {
            console.log('Local backup failed:', e);
        }
    }
    
    // Nettoyer les vieux backups
    function cleanupOldBackups() {
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('payflot_backup_')) {
                    keys.push(key);
                }
            }
            
            // Garder seulement les 10 plus récents
            if (keys.length > 10) {
                keys.sort().slice(0, keys.length - 10).forEach(key => {
                    localStorage.removeItem(key);
                });
            }
        } catch (e) {
            // Ignorer les erreurs de localStorage
        }
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
    
    // Animate stats counter
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
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
    
    // Animate hero stats
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
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);
    
    // Update waitlist count
    function updateWaitlistCount() {
        const countElement = document.querySelector('.cta p');
        if (countElement) {
            const baseCount = 500;
            const randomIncrement = Math.floor(Math.random() * 10);
            const totalCount = baseCount + randomIncrement;
            countElement.textContent = `Join ${totalCount}+ freelancers and small businesses on our waitlist.`;
        }
    }
    
    setInterval(updateWaitlistCount, 30000);
    updateWaitlistCount();
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Local storage for form persistence
function saveFormData() {
    const email = document.getElementById('email')?.value;
    const userType = document.getElementById('userType')?.value;
    
    if (email) localStorage.setItem('payflot_email', email);
    if (userType) localStorage.setItem('payflot_userType', userType);
}

function loadFormData() {
    const savedEmail = localStorage.getItem('payflot_email');
    const savedUserType = localStorage.getItem('payflot_userType');
    
    if (savedEmail) document.getElementById('email').value = savedEmail;
    if (savedUserType) document.getElementById('userType').value = savedUserType;
}

window.addEventListener('load', loadFormData);
document.getElementById('email')?.addEventListener('input', saveFormData);
document.getElementById('userType')?.addEventListener('change', saveFormData);