const express = require('express');
const router = express.Router();

/**
 * Organization Data Management Module
 * Handles organization profiles, members, and integrated financial/crypto data
 */

// Mock organization data storage
const organizations = new Map();
const organizationMembers = new Map();
const organizationSettings = new Map();

/**
 * POST /api/org/create
 * Create a new organization
 */
router.post('/create', (req, res) => {
  try {
    const { name, email, industry, country, foundedYear } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email'
      });
    }

    const organizationId = `ORG_${Date.now()}`;
    const organization = {
      organizationId,
      name,
      email,
      industry: industry || 'Finance',
      country: country || 'USA',
      foundedYear: foundedYear || new Date().getFullYear(),
      status: 'active',
      createdAt: new Date().toISOString(),
      members: 0,
      cryptoPortfolios: 0,
      financialAccounts: 0
    };

    organizations.set(organizationId, organization);
    organizationMembers.set(organizationId, []);
    organizationSettings.set(organizationId, {
      organizationId,
      notifications: true,
      twoFactorAuth: false,
      apiKeysEnabled: true,
      dataExportEnabled: true
    });

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: organization
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/org/:organizationId
 * Get organization details
 */
router.get('/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const org = organizations.get(organizationId);

    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    const members = organizationMembers.get(organizationId) || [];
    const settings = organizationSettings.get(organizationId) || {};

    res.json({
      success: true,
      data: {
        ...org,
        members: members.length,
        memberDetails: members,
        settings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/org/member
 * Add a member to organization
 */
router.post('/member', (req, res) => {
  try {
    const { organizationId, name, email, role, department } = req.body;

    if (!organizationId || !name || !email || !role) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const org = organizations.get(organizationId);
    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    const memberId = `MEM_${Date.now()}`;
    const member = {
      memberId,
      organizationId,
      name,
      email,
      role, // 'admin', 'manager', 'analyst', 'viewer'
      department: department || 'General',
      joinedAt: new Date().toISOString(),
      status: 'active'
    };

    organizationMembers.get(organizationId).push(member);
    org.members = organizationMembers.get(organizationId).length;

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: member
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/org/members/:organizationId
 * Get all members of organization
 */
router.get('/members/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const members = organizationMembers.get(organizationId) || [];

    res.json({
      success: true,
      organizationId,
      memberCount: members.length,
      members: members.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/org/settings
 * Update organization settings
 */
router.post('/settings', (req, res) => {
  try {
    const { organizationId, notifications, twoFactorAuth, apiKeysEnabled, dataExportEnabled } = req.body;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'organizationId required'
      });
    }

    const org = organizations.get(organizationId);
    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    const settings = organizationSettings.get(organizationId) || {};
    
    if (notifications !== undefined) settings.notifications = notifications;
    if (twoFactorAuth !== undefined) settings.twoFactorAuth = twoFactorAuth;
    if (apiKeysEnabled !== undefined) settings.apiKeysEnabled = apiKeysEnabled;
    if (dataExportEnabled !== undefined) settings.dataExportEnabled = dataExportEnabled;

    organizationSettings.set(organizationId, settings);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/org/dashboard/:organizationId
 * Get comprehensive organization dashboard with all integrated data
 */
router.get('/dashboard/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const org = organizations.get(organizationId);

    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    const members = organizationMembers.get(organizationId) || [];
    const settings = organizationSettings.get(organizationId) || {};

    // This would integrate with finance and crypto APIs
    const dashboard = {
      organizationId,
      organization: org,
      summary: {
        totalMembers: members.length,
        activeMembers: members.filter(m => m.status === 'active').length,
        administrators: members.filter(m => m.role === 'admin').length,
        departments: [...new Set(members.map(m => m.department))]
      },
      memberBreakdown: {
        byRole: getCountByProperty(members, 'role'),
        byDepartment: getCountByProperty(members, 'department'),
        byStatus: getCountByProperty(members, 'status')
      },
      recentMembers: members.slice(-5),
      settings,
      integrations: {
        cryptoTrading: true,
        financialAccounts: true,
        banking: true
      },
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      dashboard
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/org/export/:organizationId
 * Export organization data
 */
router.get('/export/:organizationId', (req, res) => {
  try {
    const { organizationId } = req.params;
    const { format = 'json' } = req.query;

    const org = organizations.get(organizationId);
    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    const settings = organizationSettings.get(organizationId) || {};
    if (!settings.dataExportEnabled) {
      return res.status(403).json({
        success: false,
        error: 'Data export is disabled for this organization'
      });
    }

    const members = organizationMembers.get(organizationId) || [];
    const exportData = {
      exportedAt: new Date().toISOString(),
      organizationId,
      organization: org,
      members,
      memberCount: members.length
    };

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(exportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="org_${organizationId}.csv"`);
      res.send(csv);
    } else {
      // JSON format (default)
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="org_${organizationId}.json"`);
      res.json({
        success: true,
        data: exportData
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/org/bulk-import
 * Bulk import members and data
 */
router.post('/bulk-import', (req, res) => {
  try {
    const { organizationId, members } = req.body;

    if (!organizationId || !Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        error: 'organizationId and members array required'
      });
    }

    const org = organizations.get(organizationId);
    if (!org) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    const importedMembers = [];
    const errors = [];

    members.forEach((memberData, index) => {
      try {
        if (!memberData.name || !memberData.email || !memberData.role) {
          errors.push({ index, error: 'Missing required fields' });
          return;
        }

        const memberId = `MEM_${Date.now()}_${index}`;
        const member = {
          memberId,
          organizationId,
          ...memberData,
          joinedAt: new Date().toISOString(),
          status: 'active'
        };

        organizationMembers.get(organizationId).push(member);
        importedMembers.push(member);
      } catch (error) {
        errors.push({ index, error: error.message });
      }
    });

    org.members = organizationMembers.get(organizationId).length;

    res.status(201).json({
      success: true,
      message: `${importedMembers.length} members imported successfully`,
      imported: importedMembers.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      data: importedMembers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/org/all
 * List all organizations (admin only)
 */
router.get('/', (req, res) => {
  try {
    const allOrgs = Array.from(organizations.values());

    res.json({
      success: true,
      total: allOrgs.length,
      organizations: allOrgs.map(org => ({
        ...org,
        members: organizationMembers.get(org.organizationId).length
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Helper function to count properties
 */
function getCountByProperty(arr, property) {
  return arr.reduce((acc, item) => {
    acc[item[property]] = (acc[item[property]] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Helper function to convert data to CSV
 */
function convertToCSV(data) {
  const members = data.members || [];
  const headers = ['Member ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Joined At'];
  const rows = members.map(m => [
    m.memberId,
    m.name,
    m.email,
    m.role,
    m.department,
    m.status,
    m.joinedAt
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csv;
}

module.exports = router;
