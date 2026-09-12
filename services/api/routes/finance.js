const express = require('express');
const router = express.Router();

/**
 * Finance & Banking Data Analysis Module
 * Handles financial data, banking transactions, and financial analytics
 */

// Mock financial data storage
const organizationAccounts = new Map();
const transactionHistory = new Map();
const financialMetrics = new Map();

/**
 * GET /api/finance/accounts/:organizationId
 * Retrieve all financial accounts for an organization
 */
router.get('/accounts/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const accounts = organizationAccounts.get(organizationId) || [];

    res.json({
      success: true,
      organizationId,
      accountCount: accounts.length,
      accounts: accounts.map(acc => ({
        accountId: acc.accountId,
        accountType: acc.accountType,
        currency: acc.currency,
        balance: acc.balance,
        status: acc.status,
        createdAt: acc.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/finance/account
 * Create a new financial account for organization
 */
router.post('/account', (req, res) => {
  try {
    const { organizationId, accountType, currency, initialBalance } = req.body;

    if (!organizationId || !accountType || !currency) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: organizationId, accountType, currency'
      });
    }

    const accountId = `ACC_${organizationId}_${Date.now()}`;
    const account = {
      accountId,
      organizationId,
      accountType, // 'checking', 'savings', 'investment', 'trading'
      currency, // 'USD', 'EUR', 'GBP', etc.
      balance: initialBalance || 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    if (!organizationAccounts.has(organizationId)) {
      organizationAccounts.set(organizationId, []);
    }

    organizationAccounts.get(organizationId).push(account);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/finance/transaction
 * Record a financial transaction
 */
router.post('/transaction', (req, res) => {
  try {
    const { organizationId, accountId, type, amount, description, category } = req.body;

    if (!organizationId || !accountId || !type || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const transactionId = `TXN_${Date.now()}`;
    const transaction = {
      transactionId,
      organizationId,
      accountId,
      type, // 'deposit', 'withdrawal', 'transfer', 'fee'
      amount: parseFloat(amount),
      description: description || '',
      category: category || 'general',
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    if (!transactionHistory.has(organizationId)) {
      transactionHistory.set(organizationId, []);
    }

    transactionHistory.get(organizationId).push(transaction);

    // Update account balance
    const accounts = organizationAccounts.get(organizationId) || [];
    const account = accounts.find(a => a.accountId === accountId);
    if (account) {
      if (type === 'deposit') {
        account.balance += parseFloat(amount);
      } else if (type === 'withdrawal' || type === 'fee') {
        account.balance -= parseFloat(amount);
      }
      account.lastModified = new Date().toISOString();
    }

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/finance/transactions/:organizationId
 * Get transaction history for organization
 */
router.get('/transactions/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const { accountId, startDate, endDate, limit = 100 } = req.query;

    let transactions = transactionHistory.get(organizationId) || [];

    if (accountId) {
      transactions = transactions.filter(t => t.accountId === accountId);
    }

    if (startDate) {
      transactions = transactions.filter(t => new Date(t.timestamp) >= new Date(startDate));
    }

    if (endDate) {
      transactions = transactions.filter(t => new Date(t.timestamp) <= new Date(endDate));
    }

    transactions = transactions.slice(0, parseInt(limit));

    res.json({
      success: true,
      organizationId,
      transactionCount: transactions.length,
      transactions: transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/finance/analytics/:organizationId
 * Generate comprehensive financial analytics
 */
router.get('/analytics/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const accounts = organizationAccounts.get(organizationId) || [];
    const transactions = transactionHistory.get(organizationId) || [];

    // Calculate metrics
    const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    const categoryBreakdown = {};
    transactions.forEach(txn => {
      if (!categoryBreakdown[txn.category]) {
        categoryBreakdown[txn.category] = { deposits: 0, withdrawals: 0 };
      }
      if (txn.type === 'deposit') {
        categoryBreakdown[txn.category].deposits += txn.amount;
      } else {
        categoryBreakdown[txn.category].withdrawals += txn.amount;
      }
    });

    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal' || t.type === 'fee')
      .reduce((sum, t) => sum + t.amount, 0);

    const analytics = {
      organizationId,
      timestamp: new Date().toISOString(),
      summary: {
        totalAssets,
        accountCount: accounts.length,
        transactionCount: transactions.length,
        totalDeposits,
        totalWithdrawals,
        netFlow: totalDeposits - totalWithdrawals
      },
      accountBreakdown: accounts.map(acc => ({
        accountId: acc.accountId,
        type: acc.accountType,
        balance: acc.balance,
        percentage: totalAssets > 0 ? ((acc.balance / totalAssets) * 100).toFixed(2) + '%' : '0%'
      })),
      categoryAnalysis: categoryBreakdown,
      insights: generateFinancialInsights(totalAssets, totalDeposits, totalWithdrawals, accounts)
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/finance/budget
 * Create a budget for organization
 */
router.post('/budget', (req, res) => {
  try {
    const { organizationId, name, totalAmount, categories } = req.body;

    if (!organizationId || !name || !totalAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const budgetId = `BUDGET_${Date.now()}`;
    const budget = {
      budgetId,
      organizationId,
      name,
      totalAmount: parseFloat(totalAmount),
      categories: categories || [],
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    if (!financialMetrics.has(organizationId)) {
      financialMetrics.set(organizationId, { budgets: [] });
    }

    financialMetrics.get(organizationId).budgets.push(budget);

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: budget
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/finance/budget/:organizationId
 * Get budgets for organization
 */
router.get('/budget/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const metrics = financialMetrics.get(organizationId) || { budgets: [] };

    res.json({
      success: true,
      organizationId,
      budgetCount: metrics.budgets.length,
      budgets: metrics.budgets
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Helper function to generate financial insights
 */
function generateFinancialInsights(totalAssets, totalDeposits, totalWithdrawals, accounts) {
  const insights = [];

  if (totalAssets < 0) {
    insights.push('⚠️ Negative balance detected. Review withdrawals and deposits.');
  } else if (totalAssets === 0) {
    insights.push('ℹ️ No assets currently. Start by making deposits.');
  } else if (totalAssets < 10000) {
    insights.push('📊 Building financial base. Consider increasing deposits.');
  } else {
    insights.push('✅ Good financial position maintained.');
  }

  if (totalWithdrawals > totalDeposits) {
    insights.push('⚠️ Withdrawals exceed deposits. Review spending patterns.');
  }

  if (accounts.length > 3) {
    insights.push('💡 Multiple accounts detected. Consider consolidation for easier management.');
  }

  const savingRate = totalDeposits > 0 ? ((totalDeposits - totalWithdrawals) / totalDeposits * 100) : 0;
  if (savingRate > 50) {
    insights.push(`🎯 Excellent savings rate: ${savingRate.toFixed(2)}%`);
  }

  return insights;
}

module.exports = router;
