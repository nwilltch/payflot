// Backend simple pour PayFlot - Collecte d'emails
// Déploie sur Vercel Functions, Railway, ou Heroku

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Fichier pour stocker les emails
const DATA_FILE = path.join(__dirname, 'waitlist.json');

// Initialiser le fichier s'il n'existe pas
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Route pour ajouter un email à la waitlist
app.post('/api/waitlist', (req, res) => {
    try {
        const { email, userType } = req.body;
        
        // Validation basique
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Email invalide' });
        }
        
        // Lire les emails existants
        let waitlist = [];
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            waitlist = JSON.parse(data);
        } catch (err) {
            console.error('Erreur lecture fichier:', err);
            waitlist = [];
        }
        
        // Vérifier si l'email existe déjà
        const exists = waitlist.some(entry => entry.email === email);
        if (exists) {
            return res.status(200).json({ 
                message: 'Email déjà inscrit',
                total: waitlist.length 
            });
        }
        
        // Ajouter le nouvel email
        const newEntry = {
            email,
            userType: userType || 'unknown',
            timestamp: new Date().toISOString(),
            ip: req.ip
        };
        
        waitlist.push(newEntry);
        
        // Sauvegarder
        fs.writeFileSync(DATA_FILE, JSON.stringify(waitlist, null, 2));
        
        console.log('Nouvel email:', email, '| Type:', userType, '| Total:', waitlist.length);
        
        // Envoyer une notification (optionnel)
        sendNotification(email, userType, waitlist.length);
        
        res.status(200).json({ 
            success: true, 
            message: 'Inscription réussie!',
            total: waitlist.length
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour voir tous les emails (PROTÉGÉE)
app.get('/api/waitlist', (req, res) => {
    const auth = req.headers.authorization;
    
    // Protection basique par token
    if (auth !== `Bearer ${process.env.ADMIN_TOKEN || 'payflot-admin'}`) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const waitlist = JSON.parse(data);
        
        res.json({
            count: waitlist.length,
            emails: waitlist
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lecture données' });
    }
});

// Route pour télécharger les emails en CSV
app.get('/api/waitlist/csv', (req, res) => {
    const auth = req.headers.authorization;
    
    if (auth !== `Bearer ${process.env.ADMIN_TOKEN || 'payflot-admin'}`) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const waitlist = JSON.parse(data);
        
        // Créer CSV
        let csv = 'Email,Type,Date,IP\n';
        waitlist.forEach(entry => {
            csv += `"${entry.email}","${entry.userType}","${entry.timestamp}","${entry.ip}"\n`;
        });
        
        res.header('Content-Type', 'text/csv');
        res.attachment('payflot-waitlist.csv');
        res.send(csv);
        
    } catch (error) {
        res.status(500).json({ error: 'Erreur génération CSV' });
    }
});

// Fonction pour envoyer une notification (optionnel)
function sendNotification(email, userType, total) {
    // Ici tu peux ajouter :
    // - Email à toi-même
    // - Notification Slack/Discord
    // - Webhook
    console.log(`📧 Nouvelle inscription: ${email} (${userType}) | Total: ${total}`);
}

// Route de santé
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 PayFlot backend démarré sur http://localhost:${PORT}`);
    console.log(`📊 API Waitlist: POST /api/waitlist`);
    console.log(`👁️  Voir emails: GET /api/waitlist (avec token)`);
    console.log(`📥 Télécharger CSV: GET /api/waitlist/csv (avec token)`);
});

module.exports = app;