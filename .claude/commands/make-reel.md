---
description: Turn an idea into a rendered vertical reel (spec, approval, preview, review)
argument-hint: <idea in one line>
---
Make a reel from this idea: $ARGUMENTS

Follow these steps in order. Stop where it says STOP.

1. Read CLAUDE.md and `specs/demo.json` so you match the format.
2. Write a short brief in chat: hook (first 2 s, readable with sound off), 3 to 5 beats, payoff, call to action, target length.
3. Write the script lines. If the language is not English, show the lines with an English gloss.
   STOP and ask the human to approve the script. For non-English, a native reader must approve.
4. Create `specs/<id>.json` (id in kebab-case). Keep stickers short; one idea per scene.
5. If the reel is non-English, show the human the exact line to add to `scripts/APPROVED_LANG` (the render command prints it). Do not add it yourself.
6. Run `pnpm check`, then `pnpm render <id> --preview`. Fix any errors.
7. Tell the human where the file is (`out/review/`) and list anything you could not verify.
   STOP. Do not move anything to `out/approved/`.
