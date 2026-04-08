// Google Apps Script pour PayFlot - Sauvegarde dans Google Sheets
// Déploie comme Web App

// Configuration
const SHEET_NAME = 'Waitlist';
const SHEET_ID = 'TON_SHEET_ID'; // À remplacer
const SCRIPT_URL = 'https://script.google.com/macros/s/TON_SCRIPT_ID/exec'; // À remplacer

function doPost(e) {
  try {
    // Récupérer les données
    const data = JSON.parse(e.postData.contents);
    const { email, userType } = data;
    
    // Validation
    if (!email || !email.includes('@')) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Email invalide' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Ouvrir le Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Vérifier si l'email existe déjà
    const emails = sheet.getRange('A:A').getValues().flat();
    if (emails.includes(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          message: 'Email déjà inscrit',
          total: emails.filter(e => e).length 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Ajouter la nouvelle ligne
    const timestamp = new Date();
    sheet.appendRow([
      email,
      userType || 'unknown',
      timestamp.toLocaleDateString(),
      timestamp.toISOString()
    ]);
    
    // Envoyer une notification (optionnel)
    sendNotification(email, userType, emails.length + 1);
    
    // Réponse
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Inscription réussie!',
        total: emails.length + 1
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Erreur:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Erreur serveur: ' + error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Route pour vérifier que l'API fonctionne
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'OK', 
      service: 'PayFlot Waitlist API',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendNotification(email, userType, total) {
  // Envoyer un email à toi-même (optionnel)
  try {
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: `📧 Nouvelle inscription PayFlot: ${email}`,
      body: `Nouvel email: ${email}\nType: ${userType}\nTotal: ${total}\n\nVoir le Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}`
    });
  } catch (e) {
    console.log('Notification email non envoyée:', e);
  }
}

// Fonction de test
function testAddEmail() {
  const testData = {
    email: 'test@example.com',
    userType: 'freelancer'
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  console.log('Test result:', result.getContent());
}