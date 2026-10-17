export type UserRole =
  | 'visitor'         // زائر غير مسجل
  | 'seeker'          // باحث مسجل عن عقار
  | 'advertiser'      // معلن فرد موثق
  | 'org_manager'     // مدير منشأة عقارية
  | 'org_agent'       // موظف إعلانات منشأة
  | 'moderator'       // مسؤول مراجعة المحتوى
  | 'verifier'        // مسؤول التحقق والمستندات
  | 'reporter_admin'  // مسؤول البلاغات والقضايا
  | 'support'         // مسؤول الدعم الفني
  | 'accountant'      // المحاسب والإدارة المالية
  | 'system_admin';   // مدير النظام

export type PropertyType =
  | 'apartment'    // شقة
  | 'villa'        // فيلا / دار
  | 'land'         // أرض / لبن
  | 'building'     // عمارة / برج
  | 'commercial'   // محل / معرض تجاري
  | 'office'       // مكتب إداري
  | 'chalet';      // استراحة / مزرعة

export type ListingPurpose =
  | 'sale'         // للبيع
  | 'rent'         // للإيجار
  | 'investment';  // للاستثمار / تشغيل

export type Currency = 'YER' | 'USD' | 'SAR';

export type AreaUnit = 'م²' | 'لبنة عشاري' | 'قصبة' | 'هكتار';

export type ListingStatus =
  | 'draft'                 // مسودة
  | 'pending_completion'    // بانتظار الاستكمال
  | 'under_review'          // قيد المراجعة
  | 'pending_verification'  // بانتظار التحقق
  | 'needs_changes'         // مطلوب تعديله
  | 'published'             // منشور ونشط
  | 'suspended'             // موقوف مؤقتاً
  | 'expired'               // منتهٍ
  | 'rejected'              // مرفوض
  | 'cancelled';            // ملغى

export interface VerificationBadge {
  type: 'phone_verified' | 'advertiser_reviewed' | 'org_reviewed' | 'deed_reviewed';
  label: string;
  description: string;
  verifiedAt: string;
  verifiedBy: string;
  validityNote: string;
  disclaimer: string;
}

export interface PrivateDocument {
  id: string;
  title: string;
  type: 'identity' | 'ownership' | 'authorization' | 'cr';
  url: string;
  uploadedAt: string;
  sizeMb: number;
}

export interface StatusTimelineEntry {
  status: ListingStatus;
  timestamp: string;
  changedBy: string;
  userRole: UserRole;
  reason?: string;
  notes?: string;
  missingFields?: string[];
}

export interface AdvertiserInfo {
  id: string;
  name: string;
  type: 'individual' | 'organization';
  phone: string;
  phoneVerified: boolean;
  allowWhatsapp: boolean;
  allowCall: boolean;
  orgId?: string;
  orgName?: string;
  licenseNumber?: string; // فقط إذا كان موثقاً فعلياً
  reputationYears?: number;
  avatarUrl?: string;
}

export interface Listing {
  id: string;
  listingNumber: string; // e.g. YEM-2026-1042
  title: string;
  description: string;
  propertyType: PropertyType;
  purpose: ListingPurpose;
  status: ListingStatus;
  
  price: number;
  currency: Currency;
  isNegotiable: boolean;
  
  area: number;
  areaUnit: AreaUnit;
  
  // الموقع
  location: {
    governorate: string; // صنعاء، عدن، تعز، ...
    city: string;
    district: string;
    street?: string;
    lat: number;
    lng: number;
    isApproximate: boolean; // حماية الخصوصية
  };
  
  // الخصائص بحسب النوع
  attributes: {
    rooms?: number;
    bathrooms?: number;
    livingRooms?: number;
    floorNumber?: number;
    totalFloors?: number;
    parkingSpaces?: number;
    buildingAgeYears?: number;
    streetWidthMeters?: number;
    streetDirection?: 'شمالي' | 'جنوبي' | 'شرقي' | 'غربي' | 'رأسي على شارعين';
    hasElevator?: boolean;
    hasWaterNetwork?: boolean;
    hasElectricity?: boolean;
    hasSolarSystem?: boolean; // شائع جداً وضروري في اليمن
    isFurnished?: boolean;
    zoningType?: 'سكني' | 'تجاري' | 'صناعي' | 'زراعي';
  };
  
  images: string[];
  privateDocuments?: PrivateDocument[]; // لا تظهر للعامة
  
  advertiser: AdvertiserInfo;
  assignedAgentId?: string;
  assignedAgentName?: string;
  
  verificationBadges: VerificationBadge[];
  statusTimeline: StatusTimelineEntry[];
  
  viewsCount: number;
  favoritesCount: number;
  featuredOrder?: number;
  isFeatured?: boolean;
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  subscriptionPackage?: 'standard' | 'featured' | 'premium';
  
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  phoneVerified: boolean;
  email?: string;
  role: UserRole;
  orgId?: string;
  orgName?: string;
  isOrgAdmin?: boolean;
  activeStatus: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface OrgMember {
  id: string;
  userId: string;
  name: string;
  phone: string;
  roleInOrg: 'manager' | 'agent' | 'assistant';
  isActive: boolean;
  assignedListingCount: number;
  joinedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  commercialRegNo: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  isVerified: boolean;
  verifiedAt?: string;
  managerId: string;
  managerName: string;
  members: OrgMember[];
  logoUrl?: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  requestType: 'individual_advertiser' | 'organization' | 'property_deed';
  targetId: string;
  targetName: string;
  submittedBy: string;
  submittedByPhone: string;
  status: 'pending' | 'under_review' | 'needs_info' | 'approved' | 'rejected';
  documents: PrivateDocument[];
  moderatorNotes?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ReportCase {
  id: string;
  caseNumber: string;
  listingId: string;
  listingTitle: string;
  listingSnapshotPrice: string;
  listingSnapshotAdvertiser: string;
  
  // سرية هوية المبلغ - لا تكشف للمعلن
  reporterName: string;
  reporterPhone: string;
  reporterConfidentialNotes?: string;
  
  reason: 'false_information' | 'duplicate_listing' | 'price_fraud' | 'unauthorized_seller' | 'offensive_content' | 'already_sold';
  details: string;
  evidenceUrls?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'advertiser_contacted' | 'resolved_ad_suspended' | 'dismissed';
  resolutionReason?: string;
  assignedOfficer?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  subject: string;
  category: 'account' | 'listing_issue' | 'verification' | 'technical' | 'inquiry';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'user' | 'support';
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetType: 'listing' | 'user' | 'organization' | 'verification' | 'report' | 'ticket' | 'system_setting' | 'staff' | 'security' | 'backup' | 'feature_flag' | 'permission';
  targetId: string;
  result: 'success' | 'warning' | 'denied';
  details: string;
}

export interface GovernorateData {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  cities: {
    name: string;
    districts: string[];
  }[];
}

// ==========================================
// ENTERPRISE ADMIN & GOVERNANCE TYPES
// ==========================================

export interface StaffMember {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  department: 'management' | 'moderation' | 'verification' | 'disputes' | 'support' | 'finance' | 'it';
  activeStatus: boolean;
  permissions: string[];
  createdAt: string;
  lastLoginAt?: string;
  notes?: string;
}

export interface StaffPermission {
  id: string;
  code: string;
  label: string;
  category: 'general' | 'content' | 'verification' | 'security' | 'financial' | 'sensitive';
  description: string;
}

export interface ActiveSession {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  ipAddress: string;
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  startedAt: string;
  lastActiveAt: string;
  isCurrentSession?: boolean;
}

export interface SecurityThreat {
  id: string;
  ipAddress: string;
  attemptType: 'failed_login' | 'unauthorized_role_elevation' | 'sql_injection_attempt' | 'brute_force' | 'suspicious_headers';
  targetUsername?: string;
  occurredAt: string;
  country: string;
  city: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  details: string;
}

export interface BlockedIp {
  ip: string;
  reason: string;
  blockedAt: string;
  blockedBy: string;
}

export interface SystemSettings {
  platformName: string;
  platformTagline: string;
  maintenanceMode: boolean;
  defaultCurrency: Currency;
  allowNewRegistrations: boolean;
  allowPublicListingPublish: boolean;
  requirePhoneOtp: boolean;
  requireIdentityVerificationForAd: boolean;
  maxDailyListingsPerUser: number;
  sessionTimeoutMinutes: number;
  maxFailedLoginAttempts: number;
  contactEmail: string;
  contactPhone: string;
  smsNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  adminAlertsPhone: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'core' | 'security' | 'commercial' | 'experimental';
  updatedAt: string;
}

export interface BackupPoint {
  id: string;
  fileName: string;
  createdAt: string;
  createdBy: string;
  sizeBytes: number;
  recordsCount: {
    listings: number;
    users: number;
    organizations: number;
    auditLogs: number;
    verifications: number;
    reports: number;
    tickets: number;
  };
  checksumSha256: string;
  status: 'valid' | 'corrupted' | 'restoring';
  notes?: string;
}

export interface SystemErrorLog {
  id: string;
  timestamp: string;
  code: string;
  module: string;
  message: string;
  stack?: string;
  severity: 'warning' | 'error' | 'fatal';
  status: 'open' | 'investigating' | 'resolved';
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface IntegrationServiceStatus {
  id: string;
  name: string;
  type: 'sms_gateway' | 'cloud_storage' | 'email_smtp' | 'maps_service' | 'payment_switch';
  endpoint: string;
  status: 'online' | 'degraded' | 'offline' | 'untested';
  latencyMs?: number;
  lastCheckedAt?: string;
  errorMessage?: string;
}

export interface EscalationCase {
  id: string;
  caseNumber: string;
  title: string;
  sourceType: 'report' | 'verification' | 'staff_override' | 'security_alert';
  sourceId: string;
  submittedBy: string;
  priority: 'medium' | 'high' | 'critical';
  status: 'pending_admin' | 'approved' | 'rejected';
  description: string;
  adminResolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
}

