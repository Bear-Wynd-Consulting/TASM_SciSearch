
export interface Persona {
  id: string;
  name: string;
  jobTitle: string;
  workTasks: string; // Considered as pain points
  industry: string;
  likes: string;
  dislikes: string;
  buyerJourneyRole?: string;
}

export interface RelatedPersonaSuggestion {
  jobTitle: string;
  likelyRoleInBuyingJourney: string;
  reasoning: string;
}

export interface SuggestedRelatedPersona extends Persona {
  reasoning?: string;
  likelyRoleInBuyingJourney?: string;
}

export interface ContentJourney {
  id: string;
  name: string;
  goal: string;
  personaIds: string[]; // Store IDs of selected personas
  outreachChannel: string;
  keyMessaging: string;
  contentOutline: string;
  aiSuggestion?: {
    suggestedContentType: string;
    rationale: string;
  };
}

export const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Marketing",
  "Real Estate",
  "Automotive",
  "Other",
] as const;

export type Industry = (typeof INDUSTRY_OPTIONS)[number];

export const OUTREACH_CHANNELS = [
  "Social Media",
  "Email",
  "Website/SEO",
  "Community",
  "Video",
  "Events/Webinars",
  "Paid Ads",
  "Content Syndication",
] as const;

export type OutreachChannel = (typeof OUTREACH_CHANNELS)[number];

export const CONTENT_JOURNEY_GOALS = [
  "Net-new Customers",
  "Upgrade Existing Customers",
  "Renewal/Retention",
  "Expansion (Cross-sell/Up-sell)",
  "Brand Awareness",
  "Lead Generation",
  "Customer Education",
] as const;

export type ContentJourneyGoal = (typeof CONTENT_JOURNEY_GOALS)[number];

export const BUYER_JOURNEY_ROLES_OPTIONS = [
  "Initiator",
  "Influencer",
  "Decision Maker",
  "Buyer",
  "User",
  "Gatekeeper",
  "Champion",
] as const;

export type BuyerJourneyRole = (typeof BUYER_JOURNEY_ROLES_OPTIONS)[number];
