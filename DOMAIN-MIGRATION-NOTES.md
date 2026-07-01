# Domain Migration: tomorrowhomes.com.au → New Vercel Site

## Goal
Point `tomorrowhomes.com.au` (currently the old 17-page site built by Geoff) to the new
1-page site built in this repo, hosted on Vercel. Then go fully in-house on DNS —
no longer dependent on Geoff / Vultr.

## Status: PAUSED — waiting on Geoff

### What's done
- Correct Vercel project identified: **`website`** (prod URL `website-liard-nu-67.vercel.app`)
- Domain added to that project in Vercel:
  - `www.tomorrowhomes.com.au` (primary)
  - `tomorrowhomes.com.au` (apex, auto-redirects to www via "Redirect apex domains to www")
- Vercel-issued DNS records needed (confirmed from the `website` project's Domains page):
  | Type | Name | Value |
  |------|------|-------|
  | A | `@` | `216.150.1.1` |
  | CNAME | `www` | `8881bd0ca64928c6.vercel-dns-016.com` |
  - Note: Vercel may show *different* record values if the domain is re-added or the
    project changes — always re-check the live Domains page before entering values,
    don't reuse old screenshots.
- Local code changes made (NOT yet committed) to switch canonical URLs from
  `tomorrowhomes.com.au` → `www.tomorrowhomes.com.au`:
  - `index.html`: canonical tag, og:url, og:image, twitter:image, JSON-LD `url`/`logo`/`image`
  - `sitemap.xml`: `<loc>`
  - `robots.txt`: `Sitemap:` line
  - Email addresses (`info@tomorrowhomes.com.au`) were left unchanged — not affected by domain redirect

### Key blocker discovered
- Domain `tomorrowhomes.com.au` is **registered at GoDaddy** but **DNS is delegated to Vultr**
  nameservers — GoDaddy's DNS Records tab is locked/read-only because of this.
- Can't edit A/CNAME records in GoDaddy until DNS is either:
  - (a) updated directly in Vultr (needs Vultr login), or
  - (b) nameservers switched back to GoDaddy's defaults (requires recreating the *entire*
    zone in GoDaddy first — MX, TXT, etc. — or email/other services will break)
- **Geoff** (who built and hosts the old site) is the one with Vultr access.
- Found via the old site's source (`tomorrowhomesGeoff/` folder, from Geoff's zip):
  git remote = `ssh://tomorrowhomes@149.28.177.254/home/tomorrowhomes/tomorrowhomes.git`
  → the old site is very likely **hosted on a Vultr VPS at IP 149.28.177.254**, not just
  using Vultr for DNS. Possible email hosting risk if MX records point to the same box.
- The Geoff zip (`tomorrowhomesGeoff/`, `tomorrowhomesGeoffdownload.zip`) contains only the
  old site's app source code (Qwik/Node/PHP) — **no DNS zone export**, so it didn't give us
  what we actually need.

### Next step (in progress)
- User is emailing Geoff to request:
  1. Full DNS zone export for `tomorrowhomes.com.au` from Vultr (A, CNAME, MX, TXT — esp. MX,
     since `info@tomorrowhomes.com.au` must keep working through the cutover)
  2. Confirmation of where email is actually hosted (same Vultr box or separate provider)
  3. Any other services/subdomains pointing at that server

- Once Geoff replies with the zone export: map records into GoDaddy, decide whether to
  switch nameservers back to GoDaddy (in-house, recommended long-term) vs. just editing
  records in Vultr, then verify DNS propagation and confirm `www.tomorrowhomes.com.au`
  goes green/valid in Vercel.

### After DNS is live — remaining TODOs
- Commit the canonical-URL code changes (currently uncommitted local edits)
- Once fully migrated off Vultr/Geoff's server: `tomorrowhomesGeoff/` folder and the old
  site's server are no longer needed (per user: new site is 1 page vs. old 17-page site)
- Push to GitHub — remember `git push` must be run by the user directly (fails from
  Claude's shell session, per CLAUDE.md)
- Submit sitemap to Google Search Console (already a pending item per CLAUDE.md, do after
  domain is live)

### Delete this file
Once the migration is complete and this context is no longer needed, delete this file —
it's a working note, not permanent project documentation.
