/*
 * What Kaia says. This is the file to edit to change the tour -- nothing else needs
 * touching.
 *
 * Every line below describes something that is actually on the page. If you add a
 * section, add its id here and she will pick it up; if you remove one, delete its entry.
 * An id that does not exist in the markup is skipped rather than breaking the tour.
 *
 * Keep lines short. She is read aloud by the browser's own speech synthesiser, and a
 * long paragraph outlasts the visitor's patience for standing still.
 */

/* Spoken when a visitor asks to meet her, before the portfolio opens. */
export const WELCOME =
  "Hi there! I'm Kaia, Laila's personal creative assistant! Welcome to her portfolio! " +
  "I'm here to guide you through her creative world. From graphic design and branding " +
  "to video production, product photography, and interactive experiences, there's " +
  "plenty to explore! Ready? Let's get started!";

/* One entry per section, keyed by the id already on the <section> element.
   `clip` is the animation she plays as she begins; it must be one of hers:
   idle, nod, tilt, hop, dance. */
export const TOUR = [
  {
    id: 'home',
    label: 'Cinematic hero',
    clip: 'hop',
    line: "This is Laila Mae Almario. She turns products, campaigns and ideas into " +
          "clear digital experiences, from the first content plan to the final post, " +
          "listing, reel or printed piece."
  },
  {
    id: 'about',
    label: 'About the creator',
    clip: 'tilt',
    line: "Here's who she is. Her work sits where creative execution meets dependable " +
          "operations. She can shape a campaign, build its content, support the " +
          "customer journey, and keep the details moving behind the scenes."
  },
  {
    id: 'experience',
    label: 'Career history',
    clip: 'nod',
    line: "Three roles built that. Social Media Manager at K-PICK Trading Corp., " +
          "E-commerce Specialist at Sinocare Healthcare Philippines, and before those, " +
          "Sales Representative at Six in One Corporation. Tap any role to open it."
  },
  {
    id: 'work',
    label: 'Design, video & multimedia',
    clip: 'tilt',
    line: "This is the work. Campaign design and branding, short-form video, planning " +
          "systems, marketplace listings, and exhibits — each one a tab you can " +
          "open. There's a tab for me too, the desktop assistant she built."
  },
  {
    id: 'print',
    label: 'Interactive 3D showroom',
    clip: 'hop',
    line: "My favourite part. These are real three-D models of the pieces she produced: " +
          "K-PICK's merchandise on the table, and Sinocare's exhibit stand. Click a " +
          "product and it lifts up so you can turn it around."
  },
  {
    id: 'skills',
    label: 'Skills & creative process',
    clip: 'nod',
    line: "Her toolkit and how she works. Canva and CapCut for content, Notion and " +
          "Google Workspace for systems, Python and the Claude API for the AI side, " +
          "and e-commerce operations across all of it."
  },
  {
    id: 'contact',
    label: 'Contact finale',
    clip: 'dance',
    line: "And that's the tour! If you'd like to work with her, her email, phone and " +
          "socials are all right here. Thanks for exploring. I hope you enjoyed it!"
  }
];

/* Preferred voices, best first. The first one the browser actually has is the one she
   keeps for the whole visit, so she does not change voice halfway through. Anything
   female and English is better than the default, which is usually male. */
export const VOICE_PREFERENCES = [
  'Google UK English Female',
  'Google US English',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Sonia Online (Natural) - English (United Kingdom)',
  'Microsoft Zira - English (United States)',
  'Samantha',
  'Karen',
  'Moira',
  'Tessa'
];

/* Tuned to sound young and friendly rather than clipped and official. */
export const VOICE_SETTINGS = { rate: 1.02, pitch: 1.18, volume: 1 };
