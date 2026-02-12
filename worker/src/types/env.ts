// Environment bindings for Cloudflare Worker
export interface Env {
  DB?: D1Database; // Optional until configured
  JWT_SECRET?: string; // Optional until configured
}
