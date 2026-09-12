const express = require('express');
const app = express();

// Import route modules
const cryptoTradingRouter = require('./routes/crypto-trading');
const financeRouter = require('./routes/finance');
const organizationRouter = require('./routes/organization');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

/**
 * API Routes
 */

// Crypto Trading API
app.use('/api/crypto', cryptoTradingRouter);

// Finance API
app.use('/api/finance', financeRouter);

// Organization API
app.use('/api/org', organizationRouter);

/**
 * API Documentation Endpoint
 */
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    apiVersion: '1.0.0',
    endpoints: {
      crypto: {
        description: 'Cryptocurrency trading and portfolio management',
        endpoints: [
          {
            method: 'GET',
            path: '/api/crypto/prices',
            description: 'Get current crypto prices',
            params: { symbols: 'BTC,ETH,SOL (optional)' }
          },
          {
            method: 'POST',
            path: '/api/crypto/portfolio',
            description: 'Create crypto portfolio',
            body: { organizationId: 'string', holdings: 'array' }
          },
          {
            method: 'GET',
            path: '/api/crypto/portfolio/:organizationId',
            description: 'Get portfolio with analysis'
          },
          {
            method: 'POST',
            path: '/api/crypto/trade',
            description: 'Record a trade',
            body: { organizationId: 'string', symbol: 'string', type: 'buy|sell', amount: 'number', price: 'number' }
          },
          {
            method: 'GET',
            path: '/api/crypto/history/:organizationId',
            description: 'Get trade history'
          },
          {
            method: 'GET',
            path: '/api/crypto/analyze/:organizationId',
            description: 'Get trading analysis and recommendations'
          }
        ]
      },
      finance: {
        description: 'Financial and banking data management',
        endpoints: [
          {
            method: 'GET',
            path: '/api/finance/accounts/:organizationId',
            description: 'Get organization accounts'
          },
          {
            method: 'POST',
            path: '/api/finance/account',
            description: 'Create new account',
            body: { organizationId: 'string', accountType: 'string', currency: 'string', initialBalance: 'number' }
          },
          {
            method: 'POST',
            path: '/api/finance/transaction',
            description: 'Record transaction',
            body: { organizationId: 'string', accountId: 'string', type: 'deposit|withdrawal|transfer|fee', amount: 'number' }
          },
          {
            method: 'GET',
            path: '/api/finance/transactions/:organizationId',
            description: 'Get transaction history'
          },
          {
            method: 'GET',
            path: '/api/finance/analytics/:organizationId',
            description: 'Get financial analytics'
          },
          {
            method: 'POST',
            path: '/api/finance/budget',
            description: 'Create budget',
            body: { organizationId: 'string', name: 'string', totalAmount: 'number', categories: 'array' }
          },
          {
            method: 'GET',
            path: '/api/finance/budget/:organizationId',
            description: 'Get organization budgets'
          }
        ]
      },
      organization: {
        description: 'Organization and member management',
        endpoints: [
          {
            method: 'POST',
            path: '/api/org/create',
            description: 'Create new organization',
            body: { name: 'string', email: 'string', industry: 'string', country: 'string' }
          },
          {
            method: 'GET',
            path: '/api/org/:organizationId',
            description: 'Get organization details'
          },
          {
            method: 'POST',
            path: '/api/org/member',
            description: 'Add organization member',
            body: { organizationId: 'string', name: 'string', email: 'string', role: 'admin|manager|analyst|viewer', department: 'string' }
          },
          {
            method: 'GET',
            path: '/api/org/members/:organizationId',
            description: 'Get organization members'
          },
          {
            method: 'POST',
            path: '/api/org/settings',
            description: 'Update organization settings'
          },
          {
            method: 'GET',
            path: '/api/org/dashboard/:organizationId',
            description: 'Get comprehensive organization dashboard'
          },
          {
            method: 'GET',
            path: '/api/org/export/:organizationId',
            description: 'Export organization data',
            params: { format: 'json|csv' }
          },
          {
            method: 'POST',
            path: '/api/org/bulk-import',
            description: 'Bulk import members'
          },
          {
            method: 'GET',
            path: '/api/org',
            description: 'List all organizations'
          }
        ]
      }
    },
    documentation: {
      baseUrl: 'http://localhost:3000',
      auth: 'API Key or JWT token (to be implemented)',
      rateLimit: '1000 requests/hour',
      versioning: 'URL-based (v1, v2, etc.)'
    }
  });
});

/**
 * 404 Error Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    hint: 'Visit /api/docs for available endpoints'
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📖 Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
