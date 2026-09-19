# Enable the private contact inbox (required before form works)

The contact UI, digital card, and logo work immediately. The message form and owner-only inbox require a database and authentication. Static Vercel hosting cannot privately store messages on its own.

1. Create a Supabase project (https://supabase.com). In Authentication > Users, create ONE owner user with your email and a strong password. Disable public sign-ups in Authentication settings. Enable email verification and MFA for the owner where available.
2. In `private_inbox_setup.sql`, replace `OWNER_EMAIL@example.com` with that exact owner account email. Run the SQL in Supabase SQL Editor. This enables public INSERT but restricts SELECT to the signed-in owner. Do not enable public SELECT. Add rate limits / CAPTCHA before sharing widely, since anonymous submissions can be spammed.
3. In Supabase Project Settings > API / Connect, copy the project URL and the **publishable / anon key** into `site-config.js`. The anon key is intentionally public and safe only with the included RLS policies. NEVER use a service_role key, secret key, or admin password in website files.
4. Commit and push `site-config.js`, `index.html`, `admin.html`, `assets/images/la-monogram.png` and other package files to GitHub. Vercel redeploys automatically. Visit `/admin.html` and sign in with the owner account to read messages. Visitors cannot access messages through the public site; access is enforced by database RLS, not by hiding a button.
5. Test: send a sample message via the public contact form, sign in to `/admin.html`, confirm it appears. Sign out and verify no messages appear. Check Supabase logs and rate limits if submissions fail.

NOTE: `admin.html` URL is not secret; authentication + RLS protects the messages. This starter inbox displays the 200 most recent messages and does not send email notifications. Set up notifications separately if desired. The form shows a clear not-connected notice until configured. If you prefer not to set up a backend, visitors can use the direct email link instead.
