const express = require('express');
const router = express.Router();

/**
 * Crypto Trading Data Analysis Module
 * Handles real-time crypto market data, portfolio analysis, and trading insights
 */

// Mock crypto data storage (replace with database)
const cryptoPortfolio = new Map();
const tradeHistory = new Map();

/**
 * GET /api/crypto/prices
 * Fetch current cryptocurrency prices and market data
 */
router.get('/prices', async (req, res) => {
  try {
    const { symbols } = req.query; // e.g., BTC,ETH,SOL
    
    const cryptoData = {
      BTC: { price: 42500.50, change24h: 2.35, volume: '28.5B', marketCap: '835B' },
      ETH: { price: 2250.75, change24h: 1.82, volume: '12.3B', marketCap: '270B' },
      SOL: { price: 98.45, change24h: 3.12, volume: '850M', marketCap: '32B' },
      XRP: { price: 0.615, change24h: 1.45, volume: '450M', marketCap: '22B' }
    };

    const filtered = symbols 
      ? Object.fromEntries(
          symbols.split(',').map(s => [s.toUpperCase(), cryptoData[s.toUpperCase()]])
        )
      : cryptoData;

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/crypto/portfolio
 * Create or update organization crypto portfolio
 */
router.post('/portfolio', (req, res) => {
  try {
    const { organizationId, holdings } = req.body;
    
    if (!organizationId || !holdings) {
      return res.status(400).json({ 
        success: false, 
        error: 'organizationId and holdings required' 
      });
    }

    // Validate holdings structure
    const validatedHoldings = holdings.map(h => ({
      symbol: h.symbol.toUpperCase(),
      amount: parseFloat(h.amount),
      entryPrice: parseFloat(h.entryPrice),
      purchaseDate: h.purchaseDate || new Date().toISOString()
    }));

    cryptoPortfolio.set(organizationId, {
      organizationId,
      holdings: validatedHoldings,
      lastUpdated: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Portfolio created successfully',
      data: cryptoPortfolio.get(organizationId)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/crypto/portfolio/:organizationId
 * Retrieve organization crypto portfolio with analysis
 */
router.get('/portfolio/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const portfolio = cryptoPortfolio.get(organizationId);

    if (!portfolio) {
      return res.status(404).json({ 
        success: false, 
        error: 'Portfolio not found' 
      });
    }

    // Calculate portfolio metrics
    const mockPrices = {
      BTC: 42500.50,
      ETH: 2250.75,
      SOL: 98.45,
      XRP: 0.615
    };

    const analysis = {
      totalValue: 0,
      totalCost: 0,
      holdings: portfolio.holdings.map(h => {
        const currentPrice = mockPrices[h.symbol] || 0;
        const value = h.amount * currentPrice;
        const cost = h.amount * h.entryPrice;
        const gain = value - cost;
        const gainPercent = (gain / cost) * 100;

        return {
          ...h,
          currentPrice,
          value,
          cost,
          gain,
          gainPercent: gainPercent.toFixed(2)
        };
      })
    };

    analysis.holdings.forEach(h => {
      analysis.totalValue += h.value;
      analysis.totalCost += h.cost;
    });

    analysis.totalGain = analysis.totalValue - analysis.totalCost;
    analysis.totalGainPercent = ((analysis.totalGain / analysis.totalCost) * 100).toFixed(2);

    res.json({
      success: true,
      organizationId,
      portfolio: portfolio,
      analysis
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/crypto/trade
 * Record a crypto trade transaction
 */
router.post('/trade', (req, res) => {
  try {
    const { organizationId, symbol, type, amount, price, date } = req.body;

    if (!organizationId || !symbol || !type || !amount || !price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: organizationId, symbol, type, amount, price'
      });
    }

    const tradeId = `TRADE_${Date.now()}`;
    const trade = {
      tradeId,
      organizationId,
      symbol: symbol.toUpperCase(),
      type: type.toLowerCase(), // 'buy' or 'sell'
      amount: parseFloat(amount),
      price: parseFloat(price),
      total: parseFloat(amount) * parseFloat(price),
      date: date || new Date().toISOString(),
      status: 'completed'
    };

    if (!tradeHistory.has(organizationId)) {
      tradeHistory.set(organizationId, []);
    }

    tradeHistory.get(organizationId).push(trade);

    res.status(201).json({
      success: true,
      message: 'Trade recorded successfully',
      data: trade
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/crypto/history/:organizationId
 * Get trade history for organization
 */
router.get('/history/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const history = tradeHistory.get(organizationId) || [];

    res.json({
      success: true,
      organizationId,
      tradeCount: history.length,
      trades: history.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/crypto/analyze/:organizationId
 * Generate detailed trading analysis and recommendations
 */
router.get('/analyze/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const portfolio = cryptoPortfolio.get(organizationId);
    const trades = tradeHistory.get(organizationId) || [];

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    const analysis = {
      organizationId,
      timestamp: new Date().toISOString(),
      metrics: {
        totalTrades: trades.length,
        buyTrades: trades.filter(t => t.type === 'buy').length,
        sellTrades: trades.filter(t => t.type === 'sell').length,
        averageTradeValue: trades.reduce((sum, t) => sum + t.total, 0) / trades.length || 0,
        diversification: portfolio.holdings.length,
        assets: portfolio.holdings.map(h => h.symbol)
      },
      riskAssessment: {
        level: portfolio.holdings.length > 3 ? 'LOW' : portfolio.holdings.length > 1 ? 'MEDIUM' : 'HIGH',
        recommendation: portfolio.holdings.length > 3 ? 'Well diversified portfolio' : 'Consider diversifying'
      },
      recommendations: [
        'Monitor market volatility regularly',
        'Rebalance portfolio quarterly',
        'Set stop-loss limits for risk management',
        'Consider dollar-cost averaging for volatile assets'
      ]
    };

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
