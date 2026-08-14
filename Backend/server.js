const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authController = require('./auth-controller');
const loanController = require('./loan-controller');
const creditPassportController = require('./credit-passport-controller');
const applicantController = require('./applicant-controller');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://talanton-trust-engine.vercel.app',
    'https://talanton-trust-engine-7.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API base / status info
app.get('/', (req, res) => {
  res.json({
    application: 'Talanton Trust Engine API',
    status: 'Running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Talanton Trust Engine API root.'
  });
});

// Auth Routes
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);

// Loan Application Routes
app.get('/api/loanapplications', loanController.getApplications);
app.get('/api/loanapplications/:reference', loanController.getApplicationByRef);
app.post('/api/loanapplications', loanController.createApplication);
app.put('/api/loanapplications/:reference/underwrite', loanController.updateUnderwriting);
app.post('/api/loanapplications/:reference/guarantor', loanController.addGuarantor);
app.post('/api/loanapplications/:reference/vote', loanController.castVote);
app.post('/api/loanapplications/:reference/route', loanController.routeStage);

// Credit Passport Routes
app.get('/api/creditpassport', creditPassportController.getPassportMembers);

// Applicant Routes
app.get('/api/applicant', applicantController.getAllApplicants);
app.get('/api/applicant/:id', applicantController.getApplicantById);
app.post('/api/applicant', applicantController.createApplicant);
app.put('/api/applicant/:id', applicantController.updateApplicant);
app.delete('/api/applicant/:id', applicantController.deleteApplicant);

// Start server
app.listen(PORT, () => {
  console.log(`[SERVER] Talanton Trust Engine backend listening on port ${PORT}`);
});
