# meatsack-brand

Canonical brand source for [showmeatsack.com](https://showmeatsack.com),
[askmeatsack.com](https://askmeatsack.com), and
[sharemeatsack.com](https://sharemeatsack.com).

This repository is documentation, artwork, tokens, and the shared homepage
shell. It is not a runtime package. Product apps vendor it as a git submodule
at `brand/` and copy selected files in with `scripts/sync-brand.mjs`.

## What lives here

| Path | Role |
| --- | --- |
| `docs/characters.md` | Silicon and meat sack appearance, relationship, scenes |
| `docs/voice.md` | Shared vocabulary and where the joke belongs |
| `tokens/tokens.json` | Shared light/dark tokens and kelp / ember / iron accents |
| `components/` | `site-chrome.tsx` and `home-sections.tsx`, including `HeroScene` |
| `assets/show/` `assets/ask/` `assets/share/` | Production logos and homepage heroes |
| `assets/shared/` | Failure artwork |
| `assets/reference/` | Character-guide reference scenes |

Product copy, questionnaire UI, shadcn tokens, and business behaviour stay in
the product repositories.

## Consume it

In a product repo:

```bash
git submodule add https://github.com/garylesueur/meatsack-brand.git brand
```

`brand.config.json` at the product root:

```json
{
  "product": "show",
  "darkMode": "media",
  "paths": {
    "failure": "public/silicon-failure.png"
  }
}
```

`product` is `show`, `ask`, or `share`. `darkMode` is `media` (prefers-color-scheme) or
`class` (`html.dark`). Then:

```bash
node brand/scripts/sync-brand.mjs
node brand/scripts/sync-brand.mjs --check
```

`--check` is what CI and `pnpm test` run. Generated files carry a do-not-edit
header; change the source here, bump the submodule, and re-sync.

## Tokens

Shared semantic colours (paper, ink, machine panel, radius) plus one accent:

- **kelp** — showmeatsack.com
- **ember** — askmeatsack.com
- **iron** — sharemeatsack.com

The generated CSS sets CSS variables only. Each app keeps its own Tailwind
`@theme` mapping and, for askmeatsack.com, the shadcn / questionnaire layer.
