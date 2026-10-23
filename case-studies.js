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

  /* ------------------------------------------------------------------- social */
  social: {
    title: 'Content operations',
    kind: 'Planning systems',
    brands: 'K-PICK Trading Corp.',
    platform: 'K-PICK Hub, internal',
    scope: 'Four working views',
    lead: 'The planning systems behind the published work: a marketing dashboard, two ' +
          'content calendars and a content studio.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'Four views from the K-PICK Hub: a marketing dashboard, a medical content ' +
        'calendar, an e-commerce campaign calendar, and a content studio for ideas and ' +
        'captions.',
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
        'The dashboard leads with a single count of content due today, which is the ' +
        'one number that changes what you do next. Task progress and upcoming posts ' +
        'sit beneath it.',
        'The two calendars are separated by business line rather than merged, so the ' +
        'medical schedule with its recurring weekly formats does not have to share a ' +
        'grid with e-commerce campaign bursts.',
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
    platform: 'Windows desktop, Telegram, K-PICK Hub',
    scope: 'One Python application',
    lead: 'A desktop assistant I designed and built to turn a day of work into a ' +
          'report, without reading anything it should not.',
    sections: [
      { id: 'overview', title: 'Project overview', basis: 'verified', body: [
        'A Python desktop application that watches which window is in front, sorts the ' +
        'day into twelve categories, drafts an end-of-day report and pushes it to the ' +
        'K-PICK Hub. It runs as an animated character on the corner of the screen.',
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
