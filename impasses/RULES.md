# RULES

1. before a pass, run dev server and VISUALLY also review each component's usage, and all examples.

2. after pass, again run dev server and VISUALLY check each component's usage and all examples.

3. see for any console errors in each case, and fix if so.

4. Run in your own browser, not user's screen.

5. Each pass end must add to this folder the final screenshot of each component's usage and each example.

6. If any proposed fix is to edit the tokens.ts file -> DO NOT! must take user approval.
> If we keep changing tokens.ts file, we will keep drifting. There has to be 1 fixed unchanging truth.


## Component Checks

if text exists in component, must use prop TextSize, TextColor
if second text also exists, ChildTextSize and ChildTextColor

no border and/or background hardcoding or via classes - either Variant prop or Surface prop

no border-radius via radius- class, only Shape

All rules of AGENTS.md also apply.