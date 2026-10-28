export type ContactRuntimeConfig = {
  emailEnabled: boolean;
  resendApiKey?: string;
  notifyEmail: string;
  resendFromEmail?: string;
  notionEnabled: boolean;
  notionToken?: string;
  notionDatabaseId?: string;
  supabaseEnabled: boolean;
  supabaseUrl?: string;
  supabaseServiceRoleKey?: string;
  turnstileEnabled: boolean;
  turnstileSecretKey?: string;
};

export function getContactRuntimeConfig(): ContactRuntimeConfig {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  const notifyEmail = process.env.CHEF_BRIE_NOTIFY_EMAIL ?? "chefbrie.01@gmail.com";

  const notionToken = process.env.NOTION_TOKEN;
  const notionDatabaseId = process.env.NOTION_SUBMISSIONS_DATABASE_ID;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;

  return {
    emailEnabled: Boolean(resendApiKey && resendFromEmail),
    resendApiKey,
    notifyEmail,
    resendFromEmail,
    notionEnabled: Boolean(notionToken && notionDatabaseId),
    notionToken,
    notionDatabaseId,
    supabaseEnabled: Boolean(supabaseUrl && supabaseServiceRoleKey),
    supabaseUrl,
    supabaseServiceRoleKey,
    turnstileEnabled: Boolean(turnstileSecretKey),
    turnstileSecretKey,
  };
}

export function isContactHandlerConfigured(): boolean {
  const cfg = getContactRuntimeConfig();
  return cfg.emailEnabled || cfg.notionEnabled || cfg.supabaseEnabled;
}
