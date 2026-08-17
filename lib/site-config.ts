// Override with NEXT_PUBLIC_SITE_URL per environment (preview deploys, staging).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://krishawomenshospital.com';

// Single public contact address — also the domain admin accounts sign in with.
export const CONTACT_EMAIL = 'admin@krishawomenshospital.com';
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
