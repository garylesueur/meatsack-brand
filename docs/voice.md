---
id: site-voice
area: Site / Voice
status: future
---

# How the product talks

Canonical voice guidance for showmeatsack.com and askmeatsack.com. Product spec
trees should point here rather than keeping a second copy.

**showmeatsack.com** is a silly name doing a serious job. The joke is an asset — it is why
the name sticks, and it is honest about what the product is: a machine handing something to
a person. This spec is where the voice is decided once, and where the switch that turns it
off lives, because some of the people paying for this will not want any of it.

## Behaviours

### B1 — The product knows what it is 🔵 future

The line the product returns to is that software wrote this and a person is reading it:
*built by silicon, for meatsacks*. It appears where somebody meets the product for the
first time — the home page, the frame's mark, the first thing an agent's reader sees — and
not on every surface, because a joke told twice is not a joke.

### B2 — The vocabulary is consistent 🔵 future

The same things are called the same things everywhere: a **meatsack** is the person,
**silicon** is the machine, a **meat locker** is where somebody keeps what they were sent
(see [keeping something you were sent](../sharing/collections/meat-locker.md)), and the
**freezer** is the part of it holding what was **frozen** — kept past its expiry. Nothing gets a second name because a different surface
needed a different word.

### B3 — The joke never sits between somebody and what they came for 🔵 future

Naming, headings and empty states may be playful. Errors, refusals, expiry notices,
anything about money, anything about privacy, and anything a person reads while trying to
finish a task are plain. Somebody who cannot open a page is not in the mood.

### B4 — A person is never called a meatsack to their face 🔵 future

The word describes the product's own position — software talking about the people it serves
— and is never used to address a reader, a customer, or somebody answering a questionnaire.
There is a difference between a name that winks and a page that calls its visitor a sack of
meat.

### B5 — An account can turn the silliness off 🔵 future

An account can set a plain voice for everything its readers see. The frame's mark, any page
served from its domain, and anything else its clients meet drop the jokes and the
vocabulary and say what they mean in ordinary words. Nothing about how the product works
changes; only how it talks.

### B6 — Plain voice is the default where it should be 🔵 future

Where an account has bought its own branding
([custom domains](../sharing/domains/custom-domains.md)), the plain voice is what it starts
with. Somebody serving their clients from their own name has to choose our tone
deliberately, not discover it in front of a customer.

### B7 — The two products sound like one company 🔵 future

showmeatsack.com and askmeatsack.com use the same vocabulary, the same jokes, and the same
plain voice when it is asked for. A person who meets both should not think they are dealing
with two different outfits.

### B8 — The name is not softened 🔵 future

The product is not renamed, initialised, or explained away for the sake of a serious
audience. An account that wants plainness gets a plain voice and its own domain; it does not
get a differently-named product. The joke is either worth making or it is not.

## Rules (Invariants)

- One vocabulary across both products, decided here.
- Errors, refusals, money and privacy copy are plain in every voice, always.
- The word *meatsack* describes the product's stance, never the reader.
- An account's chosen voice reaches everything its own readers see, and nothing else.
- Branded and custom-domain surfaces start plain, and the playful voice there is opt-in.
- British English, and the product names stay lower case: showmeatsack.com, askmeatsack.com,
  lanyard.
- The voice never changes what a thing does, what it costs, or who can see it.

## Decision Tables

### Where the voice applies

| Surface | Default voice | With plain voice set |
| --- | --- | --- |
| Home page, docs, marketing | Playful | Unchanged — this is our own front door |
| The frame's mark on a document, canvas or review link | Playful | Plain, or their own mark entirely |
| A page served from an account's own domain | Plain (B6) | Plain |
| A questionnaire somebody was sent | Playful, within B3 and B4 | Plain |
| Errors, refusals, expiry, billing, privacy | Plain | Plain |

## Open Questions

- **Blocks B1:** Which line is *the* line? Candidates: "built by silicon, for meatsacks",
  "written by silicon, read by meatsacks", "made of silicon, made for meatsacks". The second
  is the most accurate to what actually happens on a view link, and the first is the most
  quotable.
- Is plain voice a plan feature or available to everybody who asks? Charging for dignity is
  a bad look; on the other hand it arrives naturally with custom domains, which are paid.
- Does an account get to write its own line in the frame's mark, or only choose between
  ours and nothing? Their own words is more useful and is one more thing to review for
  impersonation.
- **Settled:** The place is the **meat locker**, the mechanic is **freezing**. American
  usage inside a British-English house style, chosen because it is funnier and because the
  freezer earns its keep as a real mechanic rather than a pun laid on top.

## Future Considerations

- A short style guide with real examples, once there is enough copy to be inconsistent
  about.
- The vocabulary published somewhere agents can read it, so an agent writing a page for us
  uses the same words.
- Sound and motion, if the product ever gets either.

## Out of Scope

- Renaming the product, or offering a serious-sounding alias.
- Localising the joke into other languages. The plain voice is what travels.
- Voice on surfaces the publisher controls entirely — a published HTML page or static site
  is their words, not ours.
