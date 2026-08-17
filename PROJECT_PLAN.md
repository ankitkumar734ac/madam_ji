# The Love Journey — Project Plan

## 1. Complete website concept

The website is a private, cinematic love story disguised as a birthday surprise. It behaves less like a landing page and more like a sequence of intimate rooms: each interaction earns the next emotional beat. The visual metaphor is **a handwritten love letter brought to life at midnight**—warm candlelight, rose petals, cream paper, blush silk, tiny gold details, and deep berry shadows.

The emotional arc is deliberate:

**Curiosity → Celebration → Nostalgia → Discovery → Playfulness → Intimacy → False ending → Goosebumps**

The experience is a single, mobile-first page so music never restarts and transitions feel uninterrupted. It uses real photos and specific memories as the emotional center; effects support those moments rather than competing with them.

## 2. Section-by-section user journey

1. **Private countdown (optional):** Before the birthday, a candlelit locked screen protects the surprise.
2. **Cinematic prologue:** Four short, tap-to-continue scenes slowly reveal why today matters.
3. **Grand reveal:** Her name, birthday message, a hero portrait, petals, light bloom, and restrained confetti create the first major “wow.”
4. **Memory film:** A swipeable photo reel mixes full-bleed images, handwritten captions, and tap-to-read backstories.
5. **Love constellation:** Sealed stars/hearts reveal reasons she is loved one at a time.
6. **Playful interlude:** A “how much do I love you?” question and a teasing gift interaction reset the emotional rhythm.
7. **Our timeline:** Meaningful relationship milestones arrive alternately as she scrolls.
8. **Love letter:** A tactile envelope opens into the most personal, quiet section.
9. **Birthday wish:** A clean, spacious wish gives the words room to land.
10. **False ending:** “That’s all…” creates a pause before the page contradicts itself.
11. **Final constellation:** One last interaction launches the largest visual crescendo and the final forever message.

## 3. Surprise and reveal sequence

- Prologue lines appear one at a time; the final line dissolves into the birthday hero.
- A discreet music invitation appears during the prologue and never autoplays.
- Photo captions hint that selected memories can be opened for their private stories.
- Small, unlabeled hearts hide three optional love notes; a progress charm tracks discoveries.
- Love-reason seals reveal in any order and change from “unopened” to “kept.”
- Every answer to the love question receives the same playful correction: “Wrong. More than that.”
- The gift button dodges a pointer twice, but remains tap- and keyboard-friendly.
- The false ending pauses, reveals “…or is it?”, then exposes the final button.
- The final button creates petals, hearts, light, photo fragments, and the closing promise.

The hidden content is delightful but nonessential: the main emotional story remains complete even if an Easter egg is missed.

## 4. UI/UX design direction

- **Palette:** candlelight cream, blush, dusty rose, berry, lavender haze, and antique gold.
- **Type:** high-contrast editorial serif for emotional lines; neutral sans serif for controls and small text; handwritten accent only for captions.
- **Composition:** generous negative space, asymmetric editorial layouts, soft organic curves, fine gold rules, translucent paper/glass surfaces.
- **Interaction language:** “open,” “keep,” “remember,” and “discover” instead of generic UI labels.
- **Controls:** minimum 44px touch targets, strong focus rings, visible labels, no hover-only secrets.
- **Tone:** intimate and specific, avoiding clichéd stock-template copy and excessive heart decoration.

## 5. Animation plan

- Prologue uses cross-fades, blur-to-focus text, and slow light movement.
- Hero reveal combines a scale-down portrait, text stagger, petal drift, and a brief confetti burst.
- Scroll sections use Intersection Observer for one-time fade/translate reveals.
- Photo reel uses CSS scroll snapping, subtle scale, and touch-native swiping.
- Envelope uses transform-based flap, letter lift, and shadow changes.
- Timeline grows a center/side line as entries enter view.
- Final sequence uses a lightweight DOM particle system capped for mobile.
- All continuous movement uses only `transform` and `opacity`; reduced-motion users receive immediate transitions and no ambient drift.

## 6. Photo presentation ideas

- **Hero portrait:** strongest vertical solo photo, softly masked like a fine-art print.
- **Memory reel:** 6–8 photos with varied aspect ratios and short, highly specific captions.
- **Timeline:** 3–5 couple photos connected to actual dates and stories.
- **Final mosaic:** 3 favorite images, cropped differently from earlier uses to feel fresh.
- Missing files render as intentional blush placeholders labeled with the expected filename, so setup is obvious without breaking the design.
- Production photos should be exported as AVIF/WebP, roughly 1200–1800px on the long edge, with JPEG fallback if needed.

## 7. Romantic message and content plan

Copy follows an intimacy ladder:

- **Prologue:** short, mysterious, universally readable lines.
- **Photo captions:** small observations only a partner would notice.
- **Love reasons:** specific habits, expressions, and everyday care.
- **Timeline:** concrete scenes rather than broad claims.
- **Letter:** gratitude, how she changed daily life, pride in calling her his wife, and a shared future.
- **Birthday wish:** happiness, peace, health, success, and companionship through every chapter.
- **Final line:** a simple choice/promise with no extra explanation after it.

All personal copy is stored in `config.js` for editing without touching layout code.

## 8. Mobile experience plan

- Design baseline is 360–430px wide with safe-area padding.
- Prologue and hero use `svh` to avoid mobile browser chrome jumps.
- Memory cards use horizontal scroll snap with a visible “swipe” cue.
- Hidden notes use tap targets, not hover; the dodging gift never dodges touch or keyboard input.
- Effects are capped at lower particle counts on small screens.
- Photos lazy-load below the hero; the hero image receives high fetch priority.
- No fixed background images on mobile and no horizontal page overflow.

## 9. Recommended technical stack

- **Delivery:** static HTML, modular CSS, and modern JavaScript modules, hosted on GitHub Pages/Cloudflare Pages/Vercel.
- **Animation:** native Web Animations API + CSS keyframes + Intersection Observer. This avoids a heavy runtime and gives exact control over reduced motion.
- **Content model:** centralized `config.js` object.
- **Media:** responsive AVIF/WebP/JPEG files; optional MP3/M4A song.
- **Why this stack:** zero build step, instant previews, excellent cacheability, no framework hydration cost, and simple long-term personalization.

## 10. Component and page structure

```text
index.html
├── BirthdayGate
├── StoryPrologue
├── ExperienceHeader / MusicControl / DiscoveryProgress
├── BirthdayHero
├── MemoryReel / MemoryModal
├── LoveReasons
├── PlayfulQuiz / GiftTease
├── RelationshipTimeline
├── LoveLetterEnvelope
├── BirthdayWish
├── FalseEnding
├── FinalSurpriseOverlay
└── SecretNoteToast / ParticleLayer

config.js       Personal names, dates, copy, photos, music, feature switches
script.js       Rendering, state, interactions, animation orchestration
styles.css      Design system, layout, responsive rules, motion preferences
```

## 11. Assets and information to provide

- Wife’s preferred name/nickname and your preferred sign-off.
- Birthday month/day and whether the site should remain locked until that date.
- 1 strong portrait for the hero, 6–8 memory photos, 3–5 timeline/couple photos.
- Dates and one- or two-sentence stories for each timeline memory.
- 6–10 specific things you love about her.
- 3 hidden notes or private jokes.
- A 250–500 word love letter in your natural voice (the starter can be edited).
- Final birthday wish and exact closing line.
- “Our song” as an MP3/M4A file you have permission to use.
- Optional real-world gift reveal: reservation, trip, video, QR code, or private clue.

## 12. Implementation phases

1. **Narrative and content model:** finalize emotional arc and create editable configuration.
2. **Visual foundation:** tokens, type scale, layout, responsive surfaces, decorative atmosphere.
3. **Core journey:** prologue, hero, photo reel, reasons, timeline, letter, wish.
4. **Surprise system:** Easter eggs, playful quiz, gift tease, false ending, finale.
5. **Motion and sound:** scroll reveals, envelope choreography, particles, optional persistent audio.
6. **Performance and accessibility:** image behavior, motion preference, keyboard/focus, semantic labels.
7. **Personalization and launch:** replace sample content, compress media, final device test, deploy.

## 13. Final testing checklist

- [ ] Birthday lock, countdown, unlocked day, and `?preview=birthday` work correctly.
- [ ] Prologue can be completed by touch, mouse, and keyboard.
- [ ] Music never autoplays; play/pause state is clear; missing audio fails gracefully.
- [ ] Every configured photo loads, crops well, has meaningful alt text, and opens its story.
- [ ] Missing photos show an intentional placeholder without layout shifts.
- [ ] All love reasons, hidden notes, quiz answers, gift tease, envelope, false ending, and finale work.
- [ ] Focus order is logical and focus indicators are visible.
- [ ] Reduced-motion mode removes ambient/large movement without hiding content.
- [ ] 320px, 375px, 430px, tablet, and desktop layouts have no page-level horizontal scroll.
- [ ] iOS Safari and Android Chrome handle safe areas, audio, scroll snap, and `svh` correctly.
- [ ] No uncaught console errors; reload and back/forward navigation are safe.
- [ ] Images are compressed, below-the-fold images lazy-load, and total initial payload is acceptable.
- [ ] Final copy is proofread and every placeholder has been replaced before sharing.

