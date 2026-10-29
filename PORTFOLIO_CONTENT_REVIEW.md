# Portfolio content review

Everything in the case studies that I could not establish from the work, the project
files, or your scope-of-work record. **Nothing here has been deployed.**

Each item is marked in `case-studies.js` with `basis: 'draft'` and renders in the
reader with an amber "needs confirming" tag, so it is obvious on screen too. Confirm,
correct, or cut each one — then I will change its `basis` to `verified` and the tag
disappears.

How to read the three markers:

| Marker | Means |
|---|---|
| **From the work and project files** | Stated by the artwork itself, a file in the repo, or your scope-of-work document. Safe as written. |
| **Reading of the finished piece** | My analysis of composition, hierarchy, format and what the design appears built to do. Honest inference about the *work*, never a claim about what you intended. |
| **Needs confirming** | Your intent, your process, what you found hard, what you learned, how it performed. Only you can supply these. |

---

## 1. The biggest one: who you made what for, and when

**This affects the whole portfolio and I'd fix it first.**

Six of the seven campaign pubmats carry **Sinocare** branding. The 3D print models are
named `booth-cart-sinocare`, `roll-up-banners-sinocare`, `business-cards-sinocare`.
The exhibit photographs are Sinocare. But your Experience section places Sinocare at
**Jan 2024 – May 2026** and K-PICK at **May 2026 – present**, and your K-PICK role
bullets claim the booth carts, banners and calling cards.

So either:

- **(a)** that print and campaign work was done during the Sinocare role, and the
  K-PICK bullet is wrong; or
- **(b)** K-PICK distributes Sinocare and you produced it at K-PICK; or
- **(c)** some of each.

I have **not** guessed. The case studies name the brand visible in the artwork and say
nothing about which employer or period. Tell me which is true and I will attribute it
properly throughout.

- [ ] Resolved — correct attribution is: ________________

---

## 2. Drafts awaiting your confirmation

### Campaign design

- [ ] **Creative process.** Your scope record covers the calendar, brief, copy, design
      and export. It does not say how a specific idea arrived — e.g. whether the
      BER-months calendar hook came from a reference hunt, a brief, or a seasonal plan
      set weeks earlier. *In your words?*
- [ ] **Key learning (suggested).** That being unable to publish a price or a clinical
      claim pushed the work toward recognisable hooks, social proof and calendar
      relevance. *True, or is that my reading rather than your experience?*
- [ ] **Key learning (suggested).** Whether the PSD workshop piece taught you anything
      transferable about writing for clinicians versus consumers.

### Short-form video

- [ ] **Creative process.** Scripting, shooting, CapCut and export are in your scope
      record; the *order* is not. Do you write captions before the shoot or cut them to
      footage after? Interviewers ask this.
- [ ] **Key learning (suggested).** That the tutorial format taught you to design for a
      muted, one-handed viewer.
- [ ] **Key learning (suggested).** Whether same-day editing changed how you cover an
      event in the first place.
- [ ] **Two lifestyle clips** — the Nespresso coffee clip and the Biscoff drink clip
      carry no brand mark. Were these client work, personal content, or product content
      for the Shopee Biscoff listing? Their captions on the site are currently neutral
      because I don't know.

### KOKOLOCK catalogue

- [ ] **Key learning (suggested).** That designing for a messaging app changes the unit
      of design from the spread to the single page.
- [ ] **Process.** Was the page template built once and then populated, or did it
      converge after several pages? The answer is a good process story either way.

### K-PICK Marketing & Operations Dashboard (its own case study)

**Rewritten 2026-10-28.** The entry was "Marketing dashboard" and described one
screen. It is now the whole product, and every feature in it was checked against the
running project — the Flask app, its own READMEs, its test suites, the two assistants,
and the project's own outstanding list — rather than against the brief for it. Each
feature card carries **Implemented**, **In development** or **Planned**, and the three
mean different things:

| Label | What it means here |
|---|---|
| **Implemented** | the code path exists and is exercised by its own tests or by daily use |
| **In development** | built and tested, but blocked on a credential, a platform approval or an install, so it does **not** work end to end today |
| **Planned** | named but not built, or not possible on this account type |

**Marked In development, deliberately** — these are the claims a reader would most
likely assume work, and they do not:

- **Social account connections.** No Facebook App ID (developer registration still
  blocked at the device-verification step) and no public HTTPS address, which TikTok
  requires with no exception. The page reads *Awaiting account setup* and refuses every
  connect, publish and sync call.
- **Automatic publishing.** The queue is built and tested; nothing can be published
  until an account is connected, and public TikTok posting additionally needs an audit
  that has not been applied for.
- **Kibo on the content creator's PC.** Built and ready to install; not installed.
- **Live platform analytics and shop account health** are marked **Planned** for the
  same reason, with the honest note that some figures (TikTok reach, saves, watch
  time) are not in the API at all and are shown as *not available*, never estimated.

**ERP data is described as ERP-recorded, never as live marketplace data.** The feed is
live, read-only and enforced read-only in three places — but it is the company's ERP
over the office network, not a connection to Shopee, Lazada or TikTok Shop, and the
copy says so.

**Nothing is claimed that was not measured.** The Verified outcomes section counts only
things that exist — sections, products, calendar rows, listings. There is no time
saved, no adoption figure, no performance improvement, because none has been measured.

#### Screenshots — replaced 2026-10-28, and what was redacted

You sent ten current captures. **Nine are in; one is held back.** Every one that ships
was redacted first, and `catalogue/build_hub_screenshots.py` is the script that does it
— it lists each region, the file it belongs to, and the rule that put it there. Re-run
it rather than editing an image by hand, and **never swap in a raw capture.**

Redaction is pixelate-then-blur, not blur alone: a blur of small text can be partly
recovered, so each region is reduced to 10px blocks before it is blurred. What ships
cannot be read back.

| Screen | Redacted | Why |
|---|---|---|
| Overview | the top-creator handle and its peso figure | an account identifier and money |
| Overview | the Medium priority task's body text | see the note below — read this one |
| Products | a filter chip carrying a team member’s first name | colleague name (§3) |
| SEO Management | the SALES figure | company revenue |
| Script generator | "Suggested next call: ‹name› (‹company›)" | a real lead |
| HCP leads | owners tile, the whole direct-leads card, every name and company in the follow-up list, the owner chip on each row | clinician names, a customer's name, email and phone number, a partner's proposal, three colleague names |
| E-commerce, calendar, Content Studio, analytics | nothing | checked; no personal, financial or colleague data on them |

**🔴 The priority task on the Overview — please read this one.** That task's body
described a piece of competitor research, in terms that would read badly on a public
portfolio published under your own name. It is blurred. I am deliberately not quoting it
here, because this file is tracked in a **public** GitHub repository — restating a
redacted line in the notes would undo the redaction. Open the original capture if you
need to see what I mean. I blurred it rather than ask first, because the alternative was
leaving it live in a preview. My recommendation is that it stays blurred whatever else
you decide; if you disagree, tell me in chat rather than writing it into this file.

#### 🔴 Held back — the Daily log screen, and what would make it publishable

The tenth capture (**Daily log & reports ▸ Daily log**) is not in the portfolio. Three
things on it are the exact categories §3 of this document keeps off the public site:

- **A time tracker.** Seven `[auto-tracked]` rows with minute counts per category.
- **A colleague's name**, twice, in the team-chat line.
- **Your own private daily report**, in full, plus local file paths and URLs.

Redacting it would leave almost nothing — the screen *is* the private report. If you
want the reporting half of the system shown, the better capture is **Consolidated
report** or **Monthly summary** (the tabs beside Daily log), and even then it will need
the same treatment. Send one and I will process it the same way.

#### One item still needs you

- [ ] **How you want your role described.** The project files establish that the
      structure, the workflow states, the permission model and the reporting spec are
      your instructions — they are quoted in the code beside the lines that implement
      them — and that the build is AI-assisted in your own workspace. The published
      "My role" section states exactly that and no more. What the files cannot settle is
      the wording you want in front of an employer: *specified and directed*, *built
      with AI assistance*, or *co-developed*. Pick the one you would defend in an
      interview and it goes in verbatim. The old open question about whether you
      specified the three counters is resolved — the files show you did.

#### Two things worth a second look, neither a privacy issue

- [ ] **The analytics screen publishes small numbers.** It reads *Views 15*, *Reach 7*,
      *2 of 12 posts reported it*. In context that is the point — the screen refuses to
      estimate what it could not measure, and the case study says so. But an employer
      skimming may read "15 views" as the result rather than as the sample size. Keep,
      or swap for a month with more measured posts, your call.
- [ ] **The SEO screen leads with a red "latest report is missing" banner.** Same
      argument: it demonstrates that the dashboard says how old its data is instead of
      quietly showing stale figures as current. I think it is a strength and the case
      study points at it. Worth knowing it is there.

#### One judgement call to confirm

- [ ] **Your colleague is described by role, not by name.** Your brief said "assign
      content to ‹name›" and "Kibo is ‹name›'s assistant". The published copy says
      *our content creator* instead, because §3 of this document keeps colleague names
      off the public site and that rule was not written with an exception for prose.
      Say the word and the name goes in; it is a one-line change in two places.

#### What was dropped

The old "What I would improve" section is gone. It criticised three decisions on the
old screen — the 499 counter, "Do first" duplicating the first upcoming row, the flat
week strip — and your brief asked for a different structure that does not include a
critique section. Nothing was lost that is still accurate; say so if you want it back.

### Content operations

- [ ] **Your role in the Hub screens.** Your scope record says you operate and
      administer the Hub at manager level and that you *specify and commission*
      internal reporting automation. It does not say how much of the dashboard, the two
      calendars and the content studio you specified yourself versus used to someone
      else's design. A recruiter will read this as product work, so it should be exact.
- [ ] **Key learning (suggested).** That a daily publishing commitment is sustained by
      the planning system rather than by effort.

### Marketplace listings

- [ ] **Key learning (suggested).** That marketplace design is constrained design —
      fixed grid, character limits, image rules.
- [ ] **Only Shopee links.** All four linked listings are Shopee, while the portfolio
      now says three storefronts. A Lazada and a TikTok Shop link would make that
      visible. Do you have ones you're happy to publish?

### Exhibits

- [ ] **Key learning (suggested).** That a shot list prepared before the event is what
      makes same-day editing possible.
- [ ] **Which expo(s)?** The scope record mentions PhilMed Expo and the HCP lead set.
      The photographs aren't individually identified. Worth naming if you're happy to.

### Print production

- [ ] **Key learning (suggested).** That print discipline differs from digital because
      a print run can't be corrected after the fact.
- [ ] **Quality control.** What do you actually check at the QC step? This is the single
      most interview-ready detail in that section and I can't invent it.

### Kaia

- [ ] **Key learning (suggested).** That building a tool you live with daily is a
      different discipline from building one you demo.

---

## 3. Things I deliberately did not write

So you know these are absent on purpose, not forgotten:

- **No performance data anywhere.** No reach, engagement, views, clicks, conversion or
  sales figures appear in any case study, because none exists in the files. If you have
  real numbers — platform analytics, a report, a screenshot — send them and I'll add an
  Outcome section to the relevant studies.
- **No client feedback or testimonials.** None supplied, none invented.
- **No invented challenges.** Several case studies have no Challenges section, because
  manufacturing a difficulty to fill a heading is worse than leaving it out.
- **No claimed process steps.** I only describe workflow steps your scope record
  actually establishes.
- **Nothing from the internal HR document beyond capability.** Colleague names, your
  system account, pricing-approver status, the ended supplier relationship, specific
  listing violations, tracked-time percentages and the HR findings are all excluded from
  the public site.

---

## 3b. The dashboard screenshot was cropped, and why

The dashboard image that was live showed more than the planning system. Below the
counters it carried **your attendance record** ("1 in · 0 off · 2 absent · 1 late"), the
**cutoff line naming a colleague**, your **time tracker**, your task-progress ring, and
the **"Signed in as Leila Almario"** footer. The lightbox served it at full resolution,
so all of that was readable by anyone who opened the image.

Section 3 of this document says colleague names and tracked-time data were deliberately
kept off the public site. The screenshot contradicted that, so it is now cropped to the
top row only — branding, the three counters, the week strip, "Do first" and the upcoming
posts. Nothing below that line is published, and the case study describes only what is
in the crop.

- [ ] **One thing the crop does not fix.** The uncropped file is still in this repo's
      git history, and the GitHub repository is public. Removing it there needs either a
      history rewrite or the repo made private — your call, and I have not done either.

---

## 4. A judgement call you may want to reverse

**Case studies are written per project area, not per asset.** There are 71 individual
assets across the portfolio (7 pubmats, 7 videos, 9 exhibit photos, 32 catalogue pages,
4 listings, 4 dashboards, 7 print products, plus Kaia). Eight case studies cover them as
bodies of work, discussing notable individual pieces inside each.

Writing 71 separate ten-section case studies would have meant padding 60-odd of them
with generic text, which the brief explicitly rules out. If you'd rather a particular
asset had its own full study — the KOKOLOCK catalogue cover, say, or the blood-pressure
tutorial — tell me which and I'll split it out.

---

## 5. Kaia in the intro — what the supplied sheet solved, and what it didn't

You sent a sheet of **17 original poses**, which replaced the workaround that was
here before. They are cut out, keyed off the black background and saved as
`kaia/poses/pose-01.png` … `pose-17.png`, with the three in use exported to
`assets/images/`.

The background was removed by flood-filling inward from the border rather than by
keying out black, because **her eyes and her headgear are genuinely black** and a
global key would have erased them. Anything enclosed by her artwork is never reached
by the fill, so her eyes survived intact.

**Now in the intro:**

| File | Pose | Where it shows |
|---|---|---|
| `kaia-present.webp` | pointing toward the card | her resting pose |
| `kaia-greet.webp` | open palm, greeting | when you hover or focus her |
| `kaia-cheer.webp` | arms up | as you enter the portfolio |

All three were placed on one 250×360 canvas with her feet on a shared baseline and her
legs centred, so swapping pose does not move her. Nothing is rotated, skewed, scaled
unevenly or recoloured. The only motion is a slow breathing float of the whole figure.

**What the sheet still does not contain:**

- [ ] **No leaning pose.** None of the 17 leans on anything. Rather than rotate her
      again to fake one, she now stands beside the card and *gestures at it* — which is
      a pose she really has. If you want the lean specifically, that frame would need
      to be drawn.
- [ ] **No blink.** Her eyes are open in every pose. Not faked.
- [ ] **Resolution.** Each pose is about 200×330 on the sheet, so she is sharp at her
      display size but has no 2× headroom. Larger exports would help if you ever want
      her bigger than she is now.

The other 14 poses — sitting, lying down, holding a blank card, holding a heart, the
side and back turnarounds, the puzzled one — are cut out and waiting in `kaia/poses/`
if you want her used elsewhere on the site.

---

## 6. Not yet deployed

Per your instruction, nothing has been pushed. The changes are committed locally only
once you say so. Current state:

- `intro.js` — new, the State A / State B gate
- `assets/images/kaia-present|greet|cheer.webp` — three of your supplied poses
- `kaia/poses/` — all 17, cut out (not deployed; `kaia/` is in .vercelignore)
- `assets/images/image-03-ebe9d46fa7.webp` — the cropped dashboard; the uncropped
  `image-03-e67638eeab.webp` is deleted from the working tree (see 3b)
- `case-studies.js` — new, all case-study content, plus the standalone `dashboard` study
- `case-study.js` — new, the reader dialog
- `index.html` — "Read the case study" triggers, plus the Approach and Growth sections
- `styles.css` — styles for the above
- `PORTFOLIO_CONTENT_REVIEW.md` — this file

**Added 2026-10-28, the dashboard rewrite** — also unpushed:

- `case-studies.js` — the `dashboard` entry replaced: new title, nine published
  sections, thirteen feature cards with implementation status, the seven-step
  workflow. The key is still `dashboard`, so the existing trigger and any link
  to it are unchanged. The `social` study's two references to it were reworded.
- `case-study.js` — the reader learned two optional block types, `items`
  (feature cards with a status pill) and `steps` (the ordered workflow). Both
  are optional, so every other case study renders exactly as before.
- `styles.css` — `.case-features`, `.case-feature`, `.case-status`,
  `.case-steps`; the spotlight heading widened from 18ch to 24ch so the longer
  title sets on two lines instead of three.
- `index.html` — the spotlight caption, heading, alt text and zoom caption; the
  Content operations panel intro; Flask added to the Systems skill list.

**Added 2026-10-28, the screenshot replacement** — also unpushed:

- `assets/images/hub-01-overview.webp` … `hub-09-leads.webp` — nine current screens,
  each redacted. `hub-01` replaces the old spotlight image.
- `catalogue/build_hub_screenshots.py` — the redaction script, so the next capture is
  processed the same way rather than by eye. `catalogue/` is in `.vercelignore`, so it
  is kept in git for you and never deployed. 🔴 **The raw captures must not be
  committed** — point `HUB_SHOTS_SRC` at a folder outside this repo.
- `app.js` — the social rail now lists the eight new screens with captions that say
  what each one demonstrates, and the set gets its own card shape.
- `styles.css` — `.media-card.wide`: a card shaped like the screenshots, with the image
  contained rather than cropped. A tall card showed a zoomed slice of a screen, which
  told a reader nothing about which screen it was.
- `index.html` — the spotlight image, its alt text and caption, and the lightbox's
  placeholder source.
- `case-studies.js` — the Screenshots section rewritten for the nine current screens;
  the "captured before the expansion" caveat is gone because it no longer applies.

The previous spotlight and rail images (`image-03` … `image-06`) are no longer
referenced. They are still on disk — delete them once you are happy with the new set.

Checked in a browser: no console errors, no horizontal page overflow, feature cards
reflow from two columns to one, the rail scrolls rather than pushing the page wide, all
74 images resolve, the gallery pages 9/9 through the lightbox, the résumé link and all
eight in-page anchors resolve, and all nine case studies open with no draft section
leaking.

Everything that was already in the portfolio is untouched.
