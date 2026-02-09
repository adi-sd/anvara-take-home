import { Router, type IRouter } from 'express';

// Middlewares
import {
  authMiddleware, // To validate session and attach user context
  requireRole, // To require user to have one of the specified roles
  requireSponsor, // To require user to be a sponsor
  requirePublisher, // To require user to be a publisher
  requireCampaignOwner, // To require user to own the campaign they're modifying/deleting
  requireAdSlotOwner, // To require user to own the ad slot they're modifying/deleting
  requireSpecificSponsor, // To require user to be the specific sponsor they're trying to modify/delete
  requireSpecificPublisher, // To require user to be the specific publisher they're trying to modify/delete
} from '../auth.js';

// Route handlers
import * as AuthRouteHandler from './auth.js';
import * as SponsorsRouteHandler from './sponsors.js';
import * as PublishersRouteHandler from './publishers.js';
import * as AdSlotsRouteHandler from './adSlots.js';
import * as CampaignsRouteHandler from './campaigns.js';
import * as PlacementsRouteHandler from './placements.js';
import * as DashboardRouteHandler from './dashboard.js';
import * as HealthRouteHandler from './health.js';

import { UserType } from '../generated/prisma/browser.js';

// Main router
const router: IRouter = Router();

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/login - Placeholder (Better Auth handles login via frontend) - PUBLIC
router.post('/auth/login', AuthRouteHandler.login);

// GET /api/auth/me - Get current user (for API clients)
router.get('/auth/me', authMiddleware, AuthRouteHandler.getCurrentUser);

// GET /api/auth/role/:userId - Get user role based on Sponsor/Publisher records
router.get(
  '/auth/role/:userId',
  authMiddleware,
  requireRole([UserType.SPONSOR, UserType.PUBLISHER]),
  AuthRouteHandler.getUserRole
);

// ============================================================
// SPONSOR ROUTES
// ============================================================

// GET /api/sponsors - List all sponsors
router.get('/sponsors', authMiddleware, SponsorsRouteHandler.getSponsors);

// GET /api/sponsors/:id - Get single sponsor with campaigns
router.get('/sponsors/:id', authMiddleware, requirePublisher, SponsorsRouteHandler.getSponsor);

// POST /api/sponsors - Create new sponsor
router.post('/sponsors', authMiddleware, SponsorsRouteHandler.createSponsor);

// PUT /api/sponsors/:id - Update sponsor details (only sponsor can update their profile)
router.put(
  '/sponsors/:id',
  authMiddleware,
  requireSponsor,
  requireSpecificSponsor,
  SponsorsRouteHandler.updateSponsor
);

// ============================================================
// PUBLISHER ROUTES
// ============================================================

// GET /api/publishers - List all publishers
router.get('/publishers', PublishersRouteHandler.getPublishers);

// GET /api/publishers/:id - Get single publisher with ad slots
router.get('/publishers/:id', authMiddleware, requireSponsor, PublishersRouteHandler.getPublisher);

// PUT /api/publishers/:id - Update publisher details (only specific publisher can update their profile)
router.put(
  '/publishers/:id',
  authMiddleware,
  requirePublisher,
  requireSpecificPublisher,
  PublishersRouteHandler.updatePublisher
);

// ============================================================
// AD SLOT ROUTES
// ============================================================

// GET /api/ad-slots - List available ad slots with optional filters (publisherId, type, availability)
router.get('/ad-slots', authMiddleware, requirePublisher, AdSlotsRouteHandler.getAdSlots);

// POST /api/ad-slots - Create new ad slot (only publisher can create)
router.post('/ad-slots', authMiddleware, requirePublisher, AdSlotsRouteHandler.createAdSlot);

// GET /api/ad-slots/:id - Get single ad slot with details
router.get(
  '/ad-slots/:id',
  authMiddleware,
  requirePublisher,
  requireAdSlotOwner,
  AdSlotsRouteHandler.getAdSlot
);

// PUT /api/ad-slots/:id - Update ad slot details (only publisher can update their ad slot)
router.put(
  '/ad-slots/:id',
  authMiddleware,
  requirePublisher,
  requireAdSlotOwner,
  AdSlotsRouteHandler.updateAdSlot
);

// DELETE /api/ad-slots/:id - Delete an ad slot (only publisher can delete their ad slot)
router.delete(
  '/ad-slots/:id',
  authMiddleware,
  requirePublisher,
  requireAdSlotOwner,
  AdSlotsRouteHandler.deleteAdSlot
);

// POST /api/ad-slots/:id/book - Book an ad slot for a campaign (only sponsor can book)
router.post('/ad-slots/:id/book', authMiddleware, requireSponsor, AdSlotsRouteHandler.bookAdSlot);

// POST /api/ad-slots/:id/unbook - Unbook an ad slot (only sponsor can unbook)
router.post(
  '/ad-slots/:id/unbook',
  authMiddleware,
  requireSponsor,
  AdSlotsRouteHandler.unbookAdSlot
);

// ============================================================
// CAMPAIGN ROUTES
// ============================================================

// GET /api/campaigns - List all campaigns with optional filters (status, sponsorId)
router.get('/campaigns', authMiddleware, requireSponsor, CampaignsRouteHandler.getCampaigns);

// POST /api/campaigns - Create new campaign (only sponsor can create)
router.post('/campaigns', authMiddleware, requireSponsor, CampaignsRouteHandler.createCampaign);

// GET /api/campaigns/:id - Get single campaign with details
router.get(
  '/campaigns/:id',
  authMiddleware,
  requireSponsor,
  requireCampaignOwner,
  CampaignsRouteHandler.getCampaign
);

// PUT /api/campaigns/:id - Update campaign details (only sponsor can update their campaign)
router.put(
  '/campaigns/:id',
  authMiddleware,
  requireSponsor,
  requireCampaignOwner,
  CampaignsRouteHandler.updateCampaign
);

// DELETE /api/campaigns/:id - Delete a campaign (only sponsor can delete their campaign)
router.delete(
  '/campaigns/:id',
  authMiddleware,
  requireSponsor,
  requireCampaignOwner,
  CampaignsRouteHandler.deleteCampaign
);

// ============================================================
// PLACEMENT ROUTES
// ============================================================

// GET /api/placements - List all placements with optional filters (campaignId, publisherId)
router.get('/placements', authMiddleware, PlacementsRouteHandler.getPlacements);

// POST /api/placements - Create new placement (only sponsor can create)
router.post('/placements', authMiddleware, requireSponsor, PlacementsRouteHandler.createPlacement);

// ============================================================
// DASHBOARD ROUTES
// ============================================================

// GET /api/dashboard/stats - Get dashboard data for sponsor
router.get('/dashboard/stats', DashboardRouteHandler.getDashboardStats);

// ============================================================
// HEALTH CHECK ROUTES
// ============================================================

// GET /api/health - Simple health check endpoint
router.get('/health', HealthRouteHandler.healthCheck);

export default router;
