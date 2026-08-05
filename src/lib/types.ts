export type RequestStatus =
  | "pending"
  | "in_review"
  | "options_shared"
  | "approved"
  | "booked"
  | "completed"
  | "cancelled";

export type TripType =
  | "flight"
  | "train"
  | "hotel"
  | "visa"
  | "other";

export type UserRole = "owner" | "consultant" | "accountant";

export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue";

export interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AgencyUser {
  id: string;
  agency_id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Client {
  id: string;
  agency_id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  credit_limit: number;
  credit_days: number;
  portal_token: string;
  outstanding_balance?: number;
  total_requests?: number;
}

export interface TravelRequest {
  id: string;
  agency_id: string;
  client_id: string;
  client?: Client;
  request_number: string;
  status: RequestStatus;
  traveler_name: string;
  traveler_email: string;
  // Multiple segments — a request can include flight + hotel + train etc.
  trip_types: TripType[];
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  purpose: string;
  budget?: number;
  // Segment-specific preferences
  preferred_class?: string;
  hotel_nights?: number;
  hotel_preference?: string;
  special_instructions?: string;
  assigned_to?: string;
  assignee?: AgencyUser;
  submitted_at: string;
  due_at?: string;
  approved_at?: string;
  options?: RequestOption[];
  messages?: RequestMessage[];
}

export interface RequestOption {
  id: string;
  request_id: string;
  option_number: number;
  segment_type: TripType;   // which segment this option covers
  provider: string;
  supplier_system: string;
  description: string;
  details: Record<string, unknown>;
  supplier_cost: number;
  client_price: number;
  margin: number;
  status: "proposed" | "approved" | "rejected" | "booked";
  is_recommended: boolean;
}

export interface RequestMessage {
  id: string;
  request_id: string;
  sender_type: "agency" | "client";
  sender_name: string;
  message: string;
  created_at: string;
}

export interface Booking {
  id: string;
  agency_id: string;
  request_id: string;
  request?: TravelRequest;
  booking_number: string;
  supplier_system: string;
  supplier_ref: string;
  supplier_cost: number;
  client_price: number;
  margin: number;
  status: "confirmed" | "issued" | "cancelled" | "completed";
  supplier_paid: boolean;
  supplier_paid_at?: string;
  supplier_paid_amount?: number;
  client_invoiced: boolean;
  client_paid: boolean;
  client_paid_at?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  agency_id: string;
  client_id: string;
  client?: Client;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  issued_date: string;
  due_date: string;
  paid_amount: number;
  notes?: string;
}

export interface Supplier {
  id: string;
  agency_id: string;
  name: string;
  type: string;
  contact_name?: string;
  contact_email?: string;
  portal_url?: string;
  credit_balance: number;
}

export interface DashboardMetrics {
  activeRequests: number;
  pendingApprovals: number;
  bookingsThisMonth: number;
  totalRevenue: number;
  outstandingReceivables: number;
  supplierPayablesDue: number;
  overdueInvoices: number;
  avgResponseTime: string;
}
