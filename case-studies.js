/*
 * The case studies behind Selected work and Print production.
 *
 * This is the file to edit. Each entry keys off a work panel's id, so a panel without
 * an entry simply has no case study and nothing breaks.
 *
 * EVERY SECTION CARRIES A `basis`, AND THAT IS THE POINT OF THE FILE:
 *
 *   'verified'  Supported by the work itself, its own artwork, the project files, or
 *               the scope-of-work record. Safe to state plainly.
 *   'analysis'  A reading of the finished piece -- composition, hierarchy, format,
 *               what the design appears built to do. Honest inference, not fact about
 *               what anyone intended.
 *   'draft'     Something only Laila can confirm: her actual intent, her process on
 *               the day, what she found hard, what she took from it, how it performed.
 *               Rendered with a visible marker and listed in
 *               PORTFOLIO_CONTENT_REVIEW.md for her to approve, correct, or cut.
 *
 * Nothing here invents a client, a metric, a piece of feedback or a result. Where a
 * section would need one of those to be worth writing, the section is absent.
 */

export const BASIS_LABEL = {
  verified: 'From the work and project files',
  analysis: 'Reading of the finished piece',
  draft: 'Draft — needs confirming before this goes live'
};

export const CASE_STUDIES = {
  /* ------------------------------------------------------------------ pubmats */
  design: {
    title: 'Campaign design',
    kind: 'Publication materials',
    brands: 'Sinocare · K-PICK',
    platform: 'Facebook and TikTok feeds',
    scope: 'Seven pieces',
    lead: 'Seven feed pieces that each do a different job: two awareness dates, a ' +
          'platform sale, a clinical event, a seasonal greeting, a trust post, and a ' +
          'seasonal hook.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'Seven social publication materials produced for feed placement. Six carry ' +
        'Sinocare branding; the BER-months piece carries K-PICK.',
        'They are not variations on one campaign. Earth Day and World Diabetes Day ' +
        'are calendar awareness posts. The Birthday Sale is co-branded with Lazada ' +
        'and carries a discount. The PSD Advanced Diabetes Workshop piece is an event ' +
        'announcement aimed at clinicians. The Christmas piece is a greeting built ' +
        'around team photographs. The proof-of-transactions piece is social proof ' +
        'with a shop button on it.'
      ] },
      { id: 'objective', title: 'Creative objective', basis: 'analysis', body: [
        'Each piece is built for a different ask, and that shows in how much work the ' +
        'image is doing. The awareness dates carry no price and no product claim — ' +
        'they buy presence on a day the audience is already thinking about the topic. ' +
        'The Birthday Sale is the only piece with a number on it, and that number is ' +
        'the largest element after the headline.',
        'The proof-of-transactions piece is the most commercially direct: a real chat ' +
        'thread as evidence, then a button. It is answering the objection "does this ' +
        'seller actually deliver" rather than describing a product.'
      ] },
      { id: 'audience', title: 'Target audience', basis: 'analysis', body: [
        'The split is visible in the design language. The consumer pieces use ' +
        'illustration, a mascot, bright seasonal colour and very short copy — built ' +
        'to be understood while scrolling.',
        'The PSD workshop piece is the exception and is addressed to a professional ' +
        'audience: it leads with the society seal and the full workshop title, carries ' +
        'a specific venue and month, and treats the devices as supporting detail ' +
        'rather than as the subject. The register changes because the reader does.'
      ] },
      { id: 'strategy', title: 'Content strategy', basis: 'analysis', body: [
        'Across the set the hierarchy is consistent: one headline that survives at ' +
        'thumbnail size, the product or the date underneath it, brand mark small and ' +
        'top-aligned. On the Birthday Sale the glucometers show live readings rather ' +
        'than blank screens, which makes the product read as in-use instead of as ' +
        'packshot.',
        'The BER-months piece is the sharpest piece of local targeting in the set. It ' +
        'uses a calendar page turning to 1 September and a Santa hat — a Philippine ' +
        'convention the audience recognises instantly and which needs no explaining ' +
        'copy at all.',
        'Only one of the seven carries a call to action. The rest are presence, not ' +
        'conversion, and the design does not pretend otherwise.'
      ] },
      { id: 'decisions', title: 'Design decisions', basis: 'analysis', body: [
        'Colour is doing categorisation work. Sinocare red anchors the clinical and ' +
        'seasonal pieces; the sale breaks to magenta, which separates a promotion from ' +
        'the brand’s standard voice; World Diabetes Day uses the blue circle that ' +
        'belongs to that campaign rather than to the brand.',
        'Type is weighted hard — heavy condensed caps for the headline, everything ' +
        'else dropped well back. On a feed card that is what keeps the message legible ' +
        'when the image is a few centimetres wide.',
        'The proof-of-transactions piece is composed around a phone screenshot held at ' +
        'an angle, which signals authenticity in a way a clean graphic would not. The ' +
        'shop button is the only hard-edged rectangle on the canvas.'
      ] },
      { id: 'constraints', title: 'Constraints the work had to respect', basis: 'verified', body: [
        'Medical-device content carries language rules that are legal exposure rather ' +
        'than house style. In the K-PICK scope these are explicit: the company may be ' +
        'described only as an FDA-licensed distributor with registration in process, ' +
        'never as "FDA-registered" or "FDA-approved"; no clinical outcome claims ' +
        'without published data; no competitor comparisons; and no pricing at all in ' +
        'client-facing content.',
        'That last rule is why so few of these pieces carry a number, and it is worth ' +
        'reading the set with it in mind: the work is designed to sell without being ' +
        'allowed to quote a price.'
      ] },
      { id: 'process', title: 'Creative process', basis: 'draft', body: [
        'The scope-of-work record establishes that the role covers the content ' +
        'calendar, the brief, the copy, the design and the export to platform ' +
        'specification — so the pipeline from plan to published file sits with one ' +
        'person.',
        'What it does not record is how a piece like the BER-months hook actually ' +
        'arrived: whether the calendar idea came from a reference hunt, a brief, or a ' +
        'seasonal plan set weeks earlier. Worth describing in your own words.'
      ] },
      { id: 'learnings', title: 'Key learnings', basis: 'draft', body: [
        'Suggested, for your confirmation: that a restriction can be a creative brief. ' +
        'Being unable to publish a price or a clinical claim pushes the work toward ' +
        'recognisable hooks, social proof and calendar relevance — which is what this ' +
        'set actually does.',
        'Also worth confirming: whether the professional-audience piece taught you ' +
        'anything transferable about writing for clinicians versus consumers.'
      ] },
      { id: 'improve', title: 'What I would improve', basis: 'analysis', body: [
        'The Christmas and proof-of-transactions pieces carry more small text than the ' +
        'others. At feed size the secondary lines are close to the limit of what is ' +
        'readable on a phone; both would survive losing a line.',
        'The set has no shared end-card or fixed brand corner. A light, consistent ' +
        'framing device would make seven separate posts read as one brand without ' +
        'flattening the differences between them.'
      ] }
    ]
  },

  /* -------------------------------------------------------------------- video */
  video: {
    title: 'Short-form video',
    kind: 'Vertical video',
    brands: 'Sinocare · lifestyle',
    platform: 'TikTok and Facebook, 9:16',
    scope: 'Seven clips, 17–58 seconds',
    lead: 'Seven vertical clips covering a device tutorial, event coverage, a ' +
          'talking-head explainer, product promotion and two lifestyle pieces.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'Seven clips, all 9:16, between 17 and 58 seconds, shot and edited for TikTok ' +
        'and Facebook. The scope-of-work record places filming, pacing, captioning, ' +
        'overlays, music selection and the CapCut edit inside the role.',
        'They are different formats, not one series: a captioned device tutorial, ' +
        'on-site coverage of a diabetes workshop, a talking-head piece on everyday ' +
        'habits, a product promotion, a live-selling invite, and two lifestyle clips.'
      ] },
      { id: 'objective', title: 'Creative objective', basis: 'analysis', body: [
        'The tutorial is the clearest case of content doing after-sales work: it walks ' +
        'through setting a blood-pressure monitor step by step, which is the question ' +
        'a customer asks after buying rather than before.',
        'The workshop clip is credibility content — it shows the brand present at a ' +
        'clinical event rather than making a claim about the brand.',
        'The live-selling invite exists to move viewers to a scheduled session, which ' +
        'is the only clip in the set with a time-bound ask.'
      ] },
      { id: 'audience', title: 'Target audience', basis: 'analysis', body: [
        'The tutorial assumes someone holding the device and slightly stuck — the ' +
        'captions name buttons rather than benefits, and the hands stay in frame ' +
        'throughout.',
        'The talking-head clip switches to Taglish and to everyday framing: stairs, ' +
        'stretching, a gift to yourself. That is a general consumer register, not a ' +
        'patient-education one, and the language choice does more audience targeting ' +
        'than any visual in the clip.'
      ] },
      { id: 'breakdown', title: 'Structure: hook → message → support → CTA', basis: 'analysis', body: [
        'Hook — the tutorial opens on the device already in hand with a caption ' +
        'mid-instruction. There is no title card and no brand intro; the clip starts ' +
        'inside the task, which is what stops a scroll.',
        'Main message — one operation per screen, numbered as steps, so the viewer ' +
        'always knows where they are in the sequence.',
        'Supporting visuals — the shot stays locked on the screen and the thumb. ' +
        'Nothing cuts away, because the thing being explained is small and the viewer ' +
        'needs to see which button is pressed.',
        'CTA — the tutorial ends on the completed state rather than a hard ask. The ' +
        'live-selling invite is the clip that carries the explicit call, which is the ' +
        'right division of labour between the two.'
      ] },
      { id: 'decisions', title: 'Editing decisions', basis: 'analysis', body: [
        'Burned-in captions throughout. Vertical video is watched muted by default, so ' +
        'the captions are the soundtrack; they also carry the step numbers, which ' +
        'means the instruction survives with the sound off.',
        'Pacing differs by format and sensibly so. The tutorial holds shots long ' +
        'enough to read a small LCD. The lifestyle clips cut on action and run short ' +
        'captions of two or three words.',
        'The event clip is assembled from handheld coverage — certificate, stage, ' +
        'slides, audience — which reads as documentation rather than as a produced ' +
        'promo, and is more convincing for it.'
      ] },
      { id: 'constraints', title: 'Constraints', basis: 'verified', body: [
        'Shot on location around live events and real devices rather than in a studio, ' +
        'so lighting and framing are what the room allowed.',
        'The same medical-device language rules apply to video as to still content: no ' +
        'clinical outcome claims, no pricing, no competitor comparison. The tutorial ' +
        'works around this by demonstrating operation rather than asserting benefit.'
      ] },
      { id: 'process', title: 'Creative process', basis: 'draft', body: [
        'Scripting, shooting, editing in CapCut and exporting to platform ' +
        'specification are all recorded as part of the role. The order you work in — ' +
        'whether the captions are written before the shoot or cut to the footage after ' +
        '— is not, and it is the part an interviewer will ask about.'
      ] },
      { id: 'learnings', title: 'Key learnings', basis: 'draft', body: [
        'Suggested, for your confirmation: that the tutorial format taught you to ' +
        'design for a muted, one-handed viewer — captions carrying the instruction, ' +
        'shots held long enough to read a device screen.',
        'Also worth confirming: whether editing event footage on the same day it was ' +
        'shot changed how you cover an event in the first place.'
      ] },
      { id: 'improve', title: 'What I would improve', basis: 'analysis', body: [
        'The two lifestyle clips carry no brand mark at all. If they are meant to work ' +
        'commercially, a light end-card would let them do so without changing their ' +
        'tone; if they are personal, they could be separated from the brand set.',
        'The longest clip runs 58 seconds with its strongest visual past the halfway ' +
        'point. A tighter open, or a cut-down second version, would give the same ' +
        'material a better chance in-feed.'
      ] }
    ]
  },

  /* ---------------------------------------------------------------- catalogue */
  catalogue: {
    title: 'KOKOLOCK product catalogue',
    kind: 'Product catalogue',
    brands: 'KOKOLOCK, for K-PICK Trading Corp.',
    platform: 'KakaoTalk distribution, A4-proportioned pages',
    scope: '32 pages, two product lines',
    lead: 'A 32-page catalogue covering smart door locks and safety vaults, built as ' +
          'single-page units for messaging-app distribution.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'Thirty-two pages produced for K-PICK Trading Corp. under the KOKOLOCK brand. ' +
        'Page one is a cover carrying the EverNet, Solity and Samsung partner marks; ' +
        'pages two to sixteen cover smart door locks for regular, sliding and glass ' +
        'doors; pages seventeen to thirty-two cover the safety vault range.',
        'Every page carries the company contact block — phone, email, website — in the ' +
        'footer, and the door-lock pages carry a price and a free-installation offer.',
        'The scope-of-work record places the door lock and vault channel on KakaoTalk ' +
        'inside the role as a standing duty, which is the distribution this artwork is ' +
        'shaped for.'
      ] },
      { id: 'objective', title: 'Creative objective', basis: 'analysis', body: [
        'This is a sales tool, not a brochure. Each page is self-contained: brand ' +
        'mark, model name, door type, feature list, what is in the box, price, offer, ' +
        'contact. A single page can be forwarded on its own and still answer a ' +
        'customer’s question without the other thirty-one.',
        'That is a direct consequence of the channel. A catalogue sent through a ' +
        'messaging app is read one image at a time, often forwarded onward, so the ' +
        'page rather than the document is the real unit of design.'
      ] },
      { id: 'audience', title: 'Target audience', basis: 'analysis', body: [
        'The structure assumes a buyer comparing models on specification and price ' +
        'rather than browsing. Feature lists are short, parallel and in the same order ' +
        'on every page, which is what makes two models comparable at a glance.',
        'The vault pages shift register: certification marks, dimension diagrams, ' +
        'fire-resistance and drop-test results. That is a buyer who needs reassurance ' +
        'about whether the product performs under stress, which is a different ' +
        'purchase anxiety from the door-lock buyer’s.'
      ] },
      { id: 'strategy', title: 'Content strategy', basis: 'analysis', body: [
        'The template is strict and the product photography is what changes. Holding ' +
        'the layout constant across thirty-two pages does two things: it makes the ' +
        'range feel like one catalogue rather than a folder of flyers, and it lets a ' +
        'reader learn the layout once and then read quickly.',
        'The cover leads with the partner brands — EverNet, Solity, Samsung — before ' +
        'any product. For a distributor, recognised manufacturer names are the ' +
        'credibility the house brand does not yet have.',
        'Door type is called out on every lock page. It is the first thing that ' +
        'disqualifies a product for a given customer, so putting it directly under the ' +
        'model name saves the reader from reading a page that cannot apply to them.'
      ] },
      { id: 'decisions', title: 'Design decisions', basis: 'analysis', body: [
        'Navy and orange throughout: navy for structure and specification, orange ' +
        'reserved almost entirely for price and offer. Colour is being used as a ' +
        'wayfinding device, so a reader scanning for cost finds it without reading.',
        'The product sits left at close to full page height, with text ranged right. ' +
        'At the size these are viewed in a chat thread, a large product silhouette is ' +
        'what identifies the page before any type is legible.',
        'The price is set in the heaviest type on the page, inside a rounded block ' +
        'that separates it from the specification list. It is unambiguous and it is ' +
        'the last thing the eye lands on.'
      ] },
      { id: 'challenges', title: 'Challenges', basis: 'analysis', body: [
        'The real constraint is density. These pages carry a feature list, an ' +
        'inclusions list, a price, an offer, a partner mark and a full contact block ' +
        'without becoming unreadable — on vault pages, dimension diagrams and ' +
        'certification marks as well.',
        'The method is consistent: one idea per horizontal band, generous spacing ' +
        'between bands, and no more than two type weights in any one band.'
      ] },
      { id: 'learnings', title: 'Key learnings', basis: 'draft', body: [
        'Suggested, for your confirmation: that designing for a messaging app rather ' +
        'than for print changes the unit of design from the spread to the single page.',
        'Also worth confirming: how the template was arrived at, and whether it was ' +
        'built once and populated, or converged on after several pages.'
      ] },
      { id: 'improve', title: 'What I would improve', basis: 'analysis', body: [
        'Prices printed into the artwork date the whole catalogue the moment they ' +
        'change, and thirty-two pages have to be reissued to correct one figure. ' +
        'Keeping price on a separate final page, or in the accompanying message, would ' +
        'make the set far cheaper to maintain.',
        'There is no index or section divider between the lock and vault ranges. In a ' +
        'chat thread that is the only navigation a reader has.'
      ] }
    ]
  },

  /* ---------------------------------------------------------------- dashboard */
  /* Keyed off `data-case` on the spotlight figure in the social panel rather than off
     a panel id, because this is one product inside Content operations rather than a
     category of its own. The key stays `dashboard` so the existing trigger, the
     spotlight figure and any link to it keep working.

     🔴 EVERY FEATURE BELOW WAS CHECKED AGAINST THE RUNNING PROJECT, not against the
     brief for it. The source is `C:\Users\User\LEILA CLAUDE\Hub` (the Flask app, its
     own READMEs and its test suites), `Bots\` (the two assistants) and `Brain\OPEN.md`
     (the project's own outstanding list). Each feature carries `status`:

       'live'      the code path exists and is exercised by its own tests or by daily use
       'building'  built and tested, but blocked on a credential, an approval or an
                   install that has not happened — so it does NOT work end to end today
       'planned'   named in the brief, not built, or not possible on this account type

     Nothing is marked 'live' on the strength of a UI control existing. Where a platform
     connection, an automatic publish or a live analytics read cannot be shown to work,
     it is 'building' and the card says what is missing. */
  dashboard: {
    title: 'K-PICK Marketing & Operations Dashboard',
    kind: 'Internal product — marketing operations',
    brands: 'K-PICK Trading Corp.',
    platform: 'Internal web application, office network',
    scope: 'Thirteen sections in eight groups',
    lead: 'The workspace our marketing work runs through: monthly planning, content ' +
          'production and review, team assignments, ERP-linked product records, and ' +
          'the reporting that closes the day.',
    sections: [
      /* ------------------------------------------------------------ 1. summary */
      { id: 'summary', title: 'Summary', basis: 'verified', body: [
        'The K-PICK Marketing & Operations Dashboard is a single internal workspace ' +
        'for planning marketing activity, managing content production, coordinating ' +
        'team tasks, monitoring connected business data and preparing reports. It ' +
        'runs on the office network and is used by our marketing team.',
        'It began as a multimedia dashboard — a calendar, a task list and a few ' +
        'counters. It now covers eight areas of the work: Overview, Marketing, ' +
        'E-commerce, Social Media, Content Creation, SEO Management, ' +
        'Communities & Leads, and Team. Two desktop assistants, Kaia and Kibo, sit ' +
        'alongside it and handle the daily reporting.',
        'Access is granted per section, per action and per record, so each member ' +
        'sees the part of the workspace they work in and nothing else.'
      ] },

      /* ----------------------------------------------- 2. problem and purpose */
      { id: 'objective', title: 'Problem and purpose', basis: 'verified', body: [
        'Our marketing work was spread across spreadsheets, chat threads, a Notion ' +
        'calendar and the company ERP. Answering an ordinary question — what is due ' +
        'today, which products need promotion, what is still waiting for my approval ' +
        '— meant opening four places and reconciling them by hand.',
        'I built this to put those answers in one place and to make the review step ' +
        'explicit. Content now has a state that everyone can see: planned, in ' +
        'progress, for approval, approved, needs revision, published. Nothing ' +
        'advances because someone remembered to mention it.',
        'The second purpose is reporting. The day used to end with writing up what ' +
        'had happened. The dashboard already holds the records — submissions, ' +
        'approvals, publications — so the report is assembled from them and I review ' +
        'and send it rather than compose it.'
      ] },

      /* ------------------------------------------------------------ 3. my role */
      { id: 'role', title: 'My role', basis: 'verified', body: [
        'I specified and directed the dashboard and I operate it day to day. The ' +
        'project files record this directly: the structure of the navigation, the ' +
        'six content states, the per-member permission model, the read-only rule on ' +
        'ERP data and the shape of the daily report are all written down as my ' +
        'instructions, and the code carries them as comments next to the lines that ' +
        'implement them.',
        'The build is AI-assisted. I work in my own project workspace with Claude ' +
        'Code: I set the requirement and the constraints, review what comes back ' +
        'against the real data, and decide what ships. The engineering judgement ' +
        'calls that I made are visible in the result — one sidebar row with internal ' +
        'tabs instead of thirteen rows, a workflow state stored locally rather than ' +
        'migrating 330 live Notion rows, and a missing number rendered as “not ' +
        'available” rather than as zero.',
        'I also run the operations side: the monthly plan, the assignments, the ' +
        'reviews and approvals, the product and listing records, and the reporting ' +
        'that goes out.'
      ] },

      /* -------------------------------------------------- 4. the feature groups */
      { id: 'features', title: 'What the sections do', basis: 'verified',
        body: [
          'Eight groups, thirteen sections. Each card below says what the section is ' +
          'for and whether it works today. “In development” means the code is built ' +
          'and tested but something outside the dashboard — a platform approval, a ' +
          'credential, an install — has not happened yet, so it does not work end to ' +
          'end. I would rather say that than imply otherwise.'
        ],
        items: [
          { name: 'Overview', status: 'live', body:
            'The screen the day opens on: content and task progress, what to do ' +
            'first, the week at a glance, upcoming posts, open tasks and the ' +
            'products that need attention. It answers what to pick up next, and ' +
            'deliberately shows nothing that would not change the next hour.' },

          { name: 'Marketing — products, pricing approvals, script generator',
            status: 'live', body:
            'Product records built from the company ERP: details, pictures, stock ' +
            'and expiry, per-platform listing prices, categories, a margin and ' +
            'discount calculator, and dated promotion remarks so the team can see ' +
            'which products need a push. Discount requests go through an approval ' +
            'queue. Cost and margin figures are a separate permission from viewing ' +
            'the product.' },

          { name: 'E-commerce — ERP-linked shop data', status: 'live', body:
            'Ten tabs reading one feed from the company ERP: stock and fulfilment ' +
            'alerts, sales, listings, campaign ideas and results, platform ad and ' +
            'promotion records, shop health and creator activity. It is ERP-recorded ' +
            'data read over the office network, not a live connection to Shopee, ' +
            'Lazada or TikTok Shop — and it is strictly read-only. There is no ' +
            'control anywhere in the section that could change a price, a stock ' +
            'level, a listing or an order, and a test fails the build if one is ever ' +
            'added.' },

          { name: 'Social media — accounts, publishing queue, post analytics',
            status: 'building', body:
            'Account organisation by brand is built: Kokolock on Facebook and ' +
            'TikTok, K-PICK E-commerce on Facebook and TikTok, K-PICK Medical on ' +
            'Facebook and Instagram, each with a record of published posts. The ' +
            'connection, publishing and analytics features are written and tested ' +
            'but not connected: the Facebook developer registration is still ' +
            'pending, and TikTok requires a public HTTPS address this dashboard does ' +
            'not yet have. Until an account authorises a real request the section ' +
            'reads “Awaiting account setup” and refuses every connect, publish and ' +
            'sync call. Nothing is ever marked connected on the strength of a token ' +
            'alone.' },

          { name: 'Content Creation — calendar, Content Studio, analytics',
            status: 'live', body:
            'The monthly calendar and the Content Studio are two views of the same ' +
            'record, so planning and production never drift apart. The workflow is ' +
            'the part I care most about: assignment, submission deadline, submitted ' +
            'files, revision comments, who approved it and when, and — per platform ' +
            '— the live link and the real publication date. Submitted, approved and ' +
            'published are kept as three separate facts, because they are. Post ' +
            'metrics are recorded against the content: TikTok counts can be read ' +
            'from a public post link, while Facebook and Instagram figures are ' +
            'entered by hand until those accounts are connected, and the page says ' +
            'which is which.' },

          { name: 'SEO Management', status: 'live', body:
            'Ten tabs for keeping marketplace listings accurate and consistent: ' +
            'product-title, category, description and thumbnail checks, keyword and ' +
            'search-position tracking, an optimiser, a modification log and daily ' +
            'reports. Every change is logged with what it was before.' },

          { name: 'Communities & Leads', status: 'live', body:
            'Two lead registers — healthcare professionals met at PhilMed Expo, and ' +
            'the peptide seller community — with tiers, owners, contact state, ' +
            'follow-ups and a per-lead order history. A call-script helper drafts a ' +
            'follow-up from the lead’s own details.' },

          { name: 'Team — assignments, requests, logs and reports', status: 'live',
            body:
            'Task assignment, a requests-and-notes board with attachments and ' +
            'notifications, daily logs, and the monthly summary. Permissions are ' +
            'per section, per action — view, create, edit, comment, submit, approve, ' +
            'publish, delete, export, see financial detail — and per record scope, ' +
            'so a member can be limited to the items assigned to them. Financial ' +
            'detail and private reports are their own grants and are off by ' +
            'default.' },

          { name: 'Kaia — my assistant', status: 'live', body:
            'A desktop assistant on my own machine, also reachable on Telegram. I ' +
            'talk to it in English or Tagalog: it answers questions about the ' +
            'dashboard’s own data, keeps reminders, runs service and test checks, ' +
            'helps with writing, and records what I did so the evening report is ' +
            'already drafted. It runs a fixed set of named jobs — it cannot be sent ' +
            'code to execute, and it does not act on the dashboard on my behalf.' },

          { name: 'Kibo — the team assistant', status: 'building', body:
            'The same assistant under a different name, for our content creator’s ' +
            'PC: work updates and his half of the reporting. The package is built ' +
            'and ready to install; until it is running on his machine the report ' +
            'labels his section “never connected” rather than inventing a quiet ' +
            'day.' },

          { name: 'Consolidated daily and monthly report', status: 'live', body:
            'One report, three sections: the content creator’s work, my workflow, ' +
            'and next actions. Every line comes from a record with a signature and ' +
            'a time — a submission, an approval, a publication — and there is no ' +
            'code path that turns a missing update into a claim about a person. ' +
            'Application usage is shown separately as context and never read as ' +
            'completed work. It is prepared as a draft on a schedule; I review it ' +
            'and send it. It never sends itself.' },

          { name: 'Automatic publishing and scheduling', status: 'building', body:
            'The publishing queue is built: one job per platform, duplicate ' +
            'prevention built into the store, and an uncertain result reconciled ' +
            'against the platform rather than retried, because the failure mode of ' +
            'guessing is posting twice on a brand’s page. Approving content never ' +
            'publishes it — that is deliberate and enforced in the code. Nothing ' +
            'can actually be published from here until the platform accounts are ' +
            'connected, and public posting to TikTok additionally needs an audit ' +
            'that has not been applied for.' },

          { name: 'Live platform analytics and shop monitoring', status: 'planned',
            body:
            'Reading reach, engagement and account health directly from Facebook, ' +
            'Instagram and TikTok needs those accounts connected and the analytics ' +
            'scopes granted. Some figures are not available from the platforms at ' +
            'all — TikTok’s API does not return reach, saves or watch time — and ' +
            'those are shown as not available rather than estimated. Shopee ' +
            'affiliate data is not available to an account of our type.' }
        ] },

      /* ------------------------------------------------------------ 5. workflow */
      { id: 'workflow', title: 'How it supports the daily workflow', basis: 'verified',
        body: [
          'One piece of content moves through the dashboard like this. Every step ' +
          'leaves a dated record, which is what makes the reporting possible at all.'
        ],
        steps: [
          'I build the monthly plan in the calendar — brand, theme, format, platform ' +
          'and posting date.',
          'I assign each item to our content creator with a submission deadline.',
          'He produces it and submits the files against the calendar item, so the ' +
          'plan and the work are the same record.',
          'I review it. I either request a revision with comments, or approve it.',
          'Approved content is published or scheduled through the configured ' +
          'integrations where a platform connection exists; otherwise it is posted ' +
          'manually and the live link and real publication date are recorded against ' +
          'the item.',
          'Results are recorded against the same item, so the plan, the production ' +
          'history and the performance history stay joined.',
          'At the end of the day the report is assembled from those records. I read ' +
          'it, correct anything, and send it.'
        ] },

      /* --------------------------------------------------------- 6. screenshots */
      { id: 'screens', title: 'Screenshots', basis: 'verified', body: [
        'Nine screens, all current. The one above is the Overview: eight navigation ' +
        'groups down the left, the counters that decide what gets touched first, the ' +
        'week at a glance, the single thing to do first, and the next posts across ' +
        'three brands.',
        'In the gallery below it — Products, where ERP records become marketing work, ' +
        'with per-platform prices and promotion remarks; E-commerce alerts, marked ' +
        'read-only on the screen itself, showing stock and shipping deadlines per ' +
        'platform; the content calendar and the Content Studio, which are the same ' +
        'month seen as a plan and as production work, carrying the planned, published ' +
        'and for-approval states; content analytics, which reports only what was ' +
        'actually measured; SEO Management, which says on its own banner how old its ' +
        'data is; the call-script generator; and the lead register.',
        'Two of those are worth looking at for what they refuse to do. The analytics ' +
        'screen says “2 of 12 posts reported it” above every figure and “no group yet ' +
        'has enough measurable posts to rank” where a ranking would normally go. The ' +
        'SEO screen leads with a red banner saying the latest report is missing and ' +
        'that the figures below are the last real data, not an estimate. Both are ' +
        'deliberate: a dashboard that fills a gap with a plausible number is worse ' +
        'than one that admits the gap.',
        'Every screenshot is redacted so that no customer or lead record, private ' +
        'report, cost, margin, revenue figure, account identifier or team ' +
        'member’s name is readable. On the lead register that means the names, ' +
        'companies and contact details are destroyed and only the structure remains ' +
        '— how many leads, at what tier, in what follow-up state. The dashboard ' +
        'itself is an internal system on the office network and is not linked from ' +
        'this site.'
      ] },

      /* ----------------------------------------------------------- 7. outcomes */
      { id: 'outcomes', title: 'Verified outcomes', basis: 'verified', body: [
        'What can be counted, counted from the project itself. No performance, ' +
        'time-saving or adoption figures are claimed here, because none has been ' +
        'measured.',
        'Thirteen sections across eight groups, with permissions defined per ' +
        'section, per action and per record scope. 490 products in the ERP-linked ' +
        'catalogue, 489 of them carrying a picture imported from the ERP. Real ' +
        'marketplace listings readable per product across three platforms. Around ' +
        '330 rows in the two content calendars, each able to carry the full ' +
        'production workflow. Ten e-commerce tabs served by a single ERP call per ' +
        'page load.',
        'The work is held up by its own test suites rather than by inspection, and ' +
        'they are run before anything is treated as working. One finding is worth ' +
        'naming: over 400 passing checks once sat on top of a data shape the ERP ' +
        'does not actually send, because the test fixture and the code had been ' +
        'built from the same written handoff. The real feed was compared field by ' +
        'field, four mismatches were corrected, and every reader now accepts both ' +
        'shapes. A fixture cannot verify the document it came from.'
      ] },

      /* -------------------------------------------------------------- 8. stack */
      { id: 'stack', title: 'Technology', basis: 'verified', body: [
        'Python and Flask on the server, with Jinja2 templates. The front end is ' +
        'plain HTML, CSS and JavaScript with no framework and no build step, and the ' +
        'charts are inline SVG with no charting library — a deliberate choice so any ' +
        'single change is one targeted edit rather than a rebuild.',
        'Data comes from the company ERP over the office network (read-only, two ' +
        'separate keys for two separate feeds), from Notion for the content ' +
        'calendars, and from Google Sheets for the expo lead list. The workflow ' +
        'records, permissions and audit trail are local JSON stores. Passwords are ' +
        'hashed; any stored platform token is encrypted at rest; every credential ' +
        'file is excluded from version control.',
        'The two assistants are Python: a desktop application with a Telegram ' +
        'interface, talking to the dashboard through its API with a device token. ' +
        'Chart colours were checked against a contrast and colour-vision validator ' +
        'rather than chosen by eye, and no data series uses the red, green or amber ' +
        'that mean something else on these screens.'
      ] },

      /* ------------------------------------------------------------- 9. status */
      { id: 'status', title: 'Current development status', basis: 'verified', body: [
        'In daily use: Overview, Marketing (products, pricing approvals, script ' +
        'generator), E-commerce, Content Creation, SEO Management, Communities & ' +
        'Leads, Team, Kaia, and the consolidated reporting.',
        'In development, blocked outside the dashboard: social account connection, ' +
        'automatic publishing and platform analytics all wait on the Facebook ' +
        'developer registration clearing, a public HTTPS address, and — for public ' +
        'TikTok posting — a platform audit. Kibo is built and waiting to be ' +
        'installed on our content creator’s PC. Backfilling submission deadlines ' +
        'across the existing calendar items is a one-time run I have not yet made.',
        'Planned or not available: making the four middle content states visible ' +
        'inside Notion would need a schema change on 330 live rows and is a separate ' +
        'decision; a read-only ERP service account would replace the personal login ' +
        'the product-image importer currently uses; Shopee affiliate data is not ' +
        'available to an account of our type.'
      ] },

      /* ----- what only she can confirm. Published nowhere; see the review doc. */
      { id: 'process', title: 'Role and process', basis: 'draft', body: [
        'The project files establish that the structure, the workflow states, the ' +
        'permission model and the reporting spec are your instructions, quoted in ' +
        'the code beside the lines that implement them, and that the build is ' +
        'AI-assisted in your own workspace. The published “My role” section states ' +
        'exactly that and no more.',
        'What the files cannot settle is how you want the split described to an ' +
        'employer — specified and directed, built with AI assistance, or ' +
        'co-developed. Pick the wording you are comfortable defending in an ' +
        'interview and it goes in verbatim.'
      ] },
      { id: 'learnings', title: 'Key learnings', basis: 'draft', body: [
        'Suggested, for your confirmation: that a daily publishing commitment is ' +
        'held up by the planning system rather than by effort; that deciding what a ' +
        'dashboard refuses to show is as much of the design as deciding what it ' +
        'shows; and that a test suite built from the same document as the code it ' +
        'tests proves only that you read the document consistently.'
      ] }
    ]
  },

  /* ------------------------------------------------------------------- social */
  social: {
    title: 'Content operations',
    kind: 'Planning systems',
    brands: 'K-PICK Trading Corp.',
    platform: 'K-PICK Marketing & Operations Dashboard',
    scope: 'Four working views',
    lead: 'The planning systems behind the published work: two content calendars and ' +
          'a content studio, inside the K-PICK Marketing & Operations Dashboard — ' +
          'which has its own case study.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'Four views from the K-PICK Marketing & Operations Dashboard: the overview ' +
        'screen, a medical content calendar, an e-commerce campaign calendar, and a ' +
        'content studio for ideas and captions.',
        'The scope-of-work record places Hub operation at manager level inside the ' +
        'role, covering Products, Pricing Approvals, SEO, Content Studio, Content ' +
        'Calendar, Script Generator, leads, tasks and reporting.'
      ] },
      { id: 'objective', title: 'Why this is in a creative portfolio', basis: 'analysis', body: [
        'Daily publishing across three brand accounts is a scheduling problem before ' +
        'it is a design problem. These screens are what makes a daily cadence ' +
        'survivable: what is due, what is published, what is still an idea.',
        'Showing them is a deliberate choice to present the operations half of the ' +
        'role rather than only the finished artwork.'
      ] },
      { id: 'strategy', title: 'What the screens show', basis: 'analysis', body: [
        'The overview opens the day with the counts that decide what gets touched ' +
        'first; the whole dashboard is taken apart in its own case study.',
        'The calendar is filtered by brand rather than merged into one grid, so the ' +
        'medical schedule with its recurring weekly formats can be read without ' +
        'e-commerce campaign bursts running through it.',
        'The content studio holds ideas and captions before they become scheduled ' +
        'posts, which keeps a backlog separate from a commitment.'
      ] },
      { id: 'process', title: 'Role and process', basis: 'draft', body: [
        'The scope record establishes that the Hub is operated and administered at ' +
        'manager level, and that internal reporting automation is specified and ' +
        'commissioned from within the role.',
        'What is not established is how much of these particular screens were ' +
        'specified by you versus built to someone else’s brief. That distinction ' +
        'matters to a recruiter reading this as product work, so it is worth being ' +
        'exact about.'
      ] },
      { id: 'learnings', title: 'Key learnings', basis: 'draft', body: [
        'Suggested, for your confirmation: that a daily publishing commitment is ' +
        'sustained by the planning system rather than by effort, and that building the ' +
        'calendar is part of the creative work rather than overhead.'
      ] }
    ]
  },

  /* ----------------------------------------------------------------- commerce */
  commerce: {
    title: 'Marketplace listings',
    kind: 'Product marketing',
    brands: 'Multiple, via K-PICK storefronts',
    platform: 'Shopee, Lazada, TikTok Shop',
    scope: 'Four live listings shown',
    lead: 'Live marketplace listings, and the catalogue work behind them: variations, ' +
          'thumbnails, A+ descriptions and the stock accuracy that keeps them selling.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'Four live Shopee listings are linked from the portfolio: Lotus Biscoff ' +
        'spread, Sungshim insulin syringes, a Hansol cupping set, and Convatec ' +
        'Stomahesive powder.',
        'The scope-of-work record places the catalogue across Shopee, Lazada and ' +
        'TikTok Shop inside the role — creating, editing and withdrawing listings, ' +
        'building variations, producing thumbnails, reconciling against ERP records, ' +
        'and monitoring account health daily.'
      ] },
      { id: 'objective', title: 'Creative objective', basis: 'analysis', body: [
        'A marketplace listing is a conversion surface, not a brochure. The thumbnail ' +
        'wins or loses the click in a grid of competitors; the variation structure ' +
        'decides whether a buyer can find the size they want; the description answers ' +
        'the question that would otherwise become a message to the seller.',
        'The four shown are deliberately unlike each other — a food product, a medical ' +
        'consumable, a wellness device and a clinical supply — which is the range the ' +
        'role actually covers.'
      ] },
      { id: 'audience', title: 'Target audience', basis: 'analysis', body: [
        'Marketplace buyers arrive through search, compare in a grid, and decide on ' +
        'thumbnail and price before they read anything. For the medical items the ' +
        'buyer is often purchasing on specification — gauge, volume, compatibility — ' +
        'where ambiguity costs a return rather than a sale.'
      ] },
      { id: 'strategy', title: 'What the work involves', basis: 'verified', body: [
        'Variations carry sizes, flavours, pack counts and clearance variants, which ' +
        'is what lets one listing serve several buying intentions instead of ' +
        'fragmenting into competing listings.',
        'Thumbnails are produced and positioned, including removing non-compliant ' +
        'marketing text across shops — platform rules on what may appear on a product ' +
        'image are enforced automatically and a violation can suspend a listing.',
        'Listings are reconciled against ERP records and stock confirmation lists, so ' +
        'what is advertised matches what can actually ship.'
      ] },
      { id: 'constraints', title: 'Constraints', basis: 'verified', body: [
        'Platform compliance is a standing daily duty, and listings can be suspended ' +
        'or banned for rule breaches that have to be investigated, corrected and ' +
        'followed through to resolution.',
        'The same medical-device language rules apply here as to published content, ' +
        'which limits what a description may claim regardless of what would sell ' +
        'better.'
      ] },
      { id: 'learnings', title: 'Key learnings', basis: 'draft', body: [
        'Suggested, for your confirmation: that marketplace design is constrained ' +
        'design — the grid, the character limits and the image rules are fixed, and ' +
        'the work is finding the clearest possible answer inside them.'
      ] },
      { id: 'improve', title: 'What I would improve', basis: 'analysis', body: [
        'All four linked listings are Shopee. The portfolio claims three storefronts, ' +
        'and a Lazada and a TikTok Shop link would make that visible rather than ' +
        'stated.',
        'A before-and-after on a single listing — thumbnail, variation structure, ' +
        'description — would show the work more directly than a link to the finished ' +
        'page.'
      ] }
    ]
  },

  /* ------------------------------------------------------------------- events */
  events: {
    title: 'Exhibits and conventions',
    kind: 'Event coverage',
    brands: 'Sinocare',
    platform: 'On-site capture, feed and story',
    scope: 'Nine pieces',
    lead: 'On-site brand work: customer engagement, product demonstration, and the ' +
          'content captured while it happens.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'Nine pieces documenting exhibit and convention work — customer engagement at ' +
        'the booth, product presentation and demonstration, team support, and content ' +
        'capture during the event.',
        'The scope-of-work record places exhibition duty inside the role: equipment ' +
        'preparation, shot lists, on-site capture, same-day editing and scheduling, ' +
        'recap production, and post-event data encoding.'
      ] },
      { id: 'objective', title: 'Creative objective', basis: 'analysis', body: [
        'Event content has a short shelf life and a double audience: the people at the ' +
        'event, and the much larger group who were not there. Same-day turnaround is ' +
        'what makes the second audience possible.',
        'The images are documentary rather than staged — hands on devices, ' +
        'conversations mid-sentence, a booth in use. That is the evidence that the ' +
        'brand was present and engaged, which a posed photograph does not provide.'
      ] },
      { id: 'audience', title: 'Target audience', basis: 'analysis', body: [
        'Healthcare professionals at a medical expo are a qualified, high-intent ' +
        'audience being met in person. The content is as much a record for the ' +
        'business as a post for the feed — the same expo produced a lead set that was ' +
        'encoded afterwards from paper forms.'
      ] },
      { id: 'decisions', title: 'Capture decisions', basis: 'analysis', body: [
        'The frames are tight on the interaction rather than wide on the stand. A ' +
        'wide booth shot shows a structure; a tight shot of a device being handed over ' +
        'shows the thing the booth was built to make happen.',
        'Available light throughout, with no apparent lighting kit. Exhibition halls ' +
        'are lit badly and inconsistently, and the work takes that as a given rather ' +
        'than fighting it.'
      ] },
      { id: 'challenges', title: 'Challenges', basis: 'analysis', body: [
        'Capturing while also working the booth is the real constraint. These are ' +
        'photographs taken by someone who is also engaging customers and supporting ' +
        'the team, which rules out anything that needs setup time.'
      ] },
      { id: 'learnings', title: 'Key learnings', basis: 'draft', body: [
        'Suggested, for your confirmation: that a shot list prepared before the event ' +
        'is what makes same-day editing possible, because the decisions are made ' +
        'before the floor gets busy.'
      ] },
      { id: 'improve', title: 'What I would improve', basis: 'analysis', body: [
        'The set shows the event but not its outcome. A short recap piece — what was ' +
        'demonstrated, who it reached — would let this work argue for its own value ' +
        'rather than only evidencing attendance.'
      ] }
    ]
  },

  /* -------------------------------------------------------------------- print */
  print: {
    title: 'Print production',
    kind: 'Print and exhibition production',
    brands: 'K-PICK · Sinocare',
    platform: 'Physical production, supplier-managed',
    scope: 'Seven products across two brands',
    lead: 'Merchandise and exhibition furniture taken from concept through suppliers ' +
          'to delivery, and rebuilt here as interactive 3D.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'Seven produced items: a branded tote in two artwork options, a notebook and ' +
        'pen set, a spray bottle, a health-monitoring booth cart, a pair of roll-up ' +
        'banners, calling cards, and handout flyers.',
        'The scope-of-work record places the full production path inside the role — ' +
        'visual concept, mockup, print-ready files, supplier sourcing, quotation ' +
        'review, production monitoring, quality check and delivery.'
      ] },
      { id: 'objective', title: 'Creative objective', basis: 'analysis', body: [
        'Two different jobs sit in this set. The K-PICK items are giveaway ' +
        'merchandise: objects that carry a brand out of the event and into ordinary ' +
        'use, where the design has to survive being useful.',
        'The Sinocare items are exhibition furniture: a cart and banners that have to ' +
        'establish a brand across a hall and hold up under exhibition lighting, read ' +
        'from several metres, and still work close up when someone reaches the counter.'
      ] },
      { id: 'decisions', title: 'Design decisions', basis: 'analysis', body: [
        'The booth cart puts the brand mark and the category line — blood glucose, ' +
        'uric acid, cholesterol, blood pressure — at standing eye height, with the ' +
        'product row beneath. That ordering works at both distances: the line is ' +
        'readable across a hall, the products reward arriving.',
        'The banners separate one product per stand rather than crowding both onto ' +
        'one, which keeps each legible at the distance a roll-up is actually read ' +
        'from.',
        'The tote carries the brand on a plain ground with the partner marks small ' +
        'and low. A giveaway that reads as advertising gets used less than one that ' +
        'reads as a bag.'
      ] },
      { id: 'challenges', title: 'Challenges', basis: 'verified', body: [
        'Print work fails at the handover, not at the design. The recorded path — ' +
        'mockup, supplier sourcing, quotation review, production monitoring, quality ' +
        'check, delivery — is a sequence of checkpoints where a colour, a substrate or ' +
        'a dimension can go wrong irreversibly once it is on press.',
        'The 3D models in this section were built from supplied mockup photographs. ' +
        'Surfaces no photograph shows are reconstructed and captioned as such on the ' +
        'model itself, rather than being presented as the real artwork.'
      ] },
      { id: 'learnings', title: 'Key learnings', basis: 'draft', body: [
        'Suggested, for your confirmation: that print discipline is different from ' +
        'digital discipline — a feed post can be corrected after publishing, a ' +
        'thousand printed totes cannot.',
        'Also worth confirming: what specifically you check at quality control, since ' +
        'that is the most interview-ready detail in this whole section.'
      ] },
      { id: 'improve', title: 'What I would improve', basis: 'analysis', body: [
        'The section shows the delivered objects but not the path described beside ' +
        'them. A single mockup-to-delivery sequence for one product would make the ' +
        'seven-step process visible rather than listed.'
      ] }
    ]
  },

  /* ---------------------------------------------------------------- assistant */
  assistant: {
    title: 'Kaia, the desktop assistant',
    kind: 'Software I built',
    brands: 'Personal build, used at K-PICK',
    platform: 'Windows desktop, Telegram, the K-PICK dashboard',
    scope: 'One Python application',
    lead: 'A desktop assistant I designed and built to turn a day of work into a ' +
          'report, without reading anything it should not.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'A Python desktop application that watches which window is in front, sorts the ' +
        'day into twelve categories, drafts an end-of-day report and pushes it to the ' +
        'K-PICK Marketing & Operations Dashboard. It runs as an animated character on ' +
        'the corner of the screen.',
        'It is the only item in this portfolio that is my own software rather than ' +
        'client work, and it is in a creative portfolio because the hardest decisions ' +
        'in it were about trust and wording rather than about code.'
      ] },
      { id: 'objective', title: 'The problem it solves', basis: 'verified', body: [
        'A daily end-of-day report to management is a standing obligation. Written by ' +
        'hand at the end of a long day it is either slow or vague, and it is the last ' +
        'thing anyone wants to do well.',
        'Kaia makes the report a by-product of the day rather than a task at the end ' +
        'of it.'
      ] },
      { id: 'decisions', title: 'Design decisions', basis: 'verified', body: [
        'The category rules read window titles first and process names second. ' +
        'Without that split a broad match like "chrome" swallows every browser window ' +
        'before the specific rules are read, and the whole day collapses into "web ' +
        'research".',
        'Banking, e-wallets, password managers, job boards, medical and streaming ' +
        'windows are counted but never named. Even the app-time report omits the ' +
        'category name, so "no report ever contains it" stays a rule with no ' +
        'exceptions rather than a promise with a loophole.',
        'The report says "worked on", never "finished". A window title cannot prove a ' +
        'task was completed; only a note added by hand can. The wording is the ' +
        'honesty of the tool.',
        'The version sent to the company group carries no durations at all. What was ' +
        'worked on is the company’s business; how long it took is mine.'
      ] },
      { id: 'challenges', title: 'Challenges', basis: 'verified', body: [
        'A tool that watches your screen is only acceptable if its limits are ' +
        'obvious. It reads the window title — the same text already printed on the ' +
        'taskbar — and never the contents of a file, a message or a keystroke.',
        'It also has to know when to stop: three minutes without keyboard or mouse ' +
        'and it stops counting, so idle time is never reported as work.'
      ] },
      { id: 'learnings', title: 'Key learnings', basis: 'draft', body: [
        'Suggested, for your confirmation: that building a tool you have to live with ' +
        'daily is a different discipline from building one you demo — the privacy ' +
        'rules and the conservative wording exist because you are the person the ' +
        'report is about.'
      ] },
      { id: 'improve', title: 'What I would improve', basis: 'analysis', body: [
        'Tracked time is foreground-application time, so shooting on location, expo ' +
        'duty and meetings are invisible to it. Any honest reading of its output has ' +
        'to account for that, and the tool could say so itself in the report rather ' +
        'than leaving the reader to know it.'
      ] }
    ]
  }
};
