# Handoff: DeckManifest + URL sharing → story-slides-swift

> **Status: done.** `story-slides-swift` shipped `DeckManifest`, `serializeDeck`/`deserializeDeck`, and `encodeDeckToParam`/`decodeDeckFromParam`/`buildShareURL`/`readDeckFromLocation` (see `Sources/StorySlides/Slide/DeckManifest.swift` and `DeckSharing.swift`), matching this spec. Kept below for historical context / as the spec the Swift implementation was checked against.

The web SDK (`story-slides-protocol`, this repo, `packages/protocol/`) just merged a second sharing protocol that **story-slides-swift does not have yet**. Everything else (StorySlide, CardWidget, ShareableDeck) is already at parity — this doc covers only the gap.

## What's missing on the Swift side

`Sources/StorySlides/Widget/ShareableDeck.swift` covers `BarajaCard`/`CardDeck` decks (file-based JSON export/import). There's no Swift equivalent of:

- `DeckManifest` — a versioned, `StorySlide`-based deck (used by `StoryDeckView`/`StoryDeck`, not `CardDeckView`/`CardDeck`).
- Serializing/validating it as JSON.
- Packing/unpacking it into a URL query param, so a `StoryDeck` link generated on web opens correctly in the iOS app (and vice versa).

Source of truth on web: `packages/protocol/src/types.ts`, `serialize.ts`, `share.ts`.

## 1. `DeckManifest` type

```ts
// packages/protocol/src/types.ts
export const DECK_MANIFEST_VERSION = 1 as const;

export interface DeckManifest {
  version: 1;
  id: string;
  title?: string;
  icon?: string;
  accentColor?: string;
  slides: StorySlide[]; // same StorySlide already ported to Swift
}
```

Port as a `Codable` struct with `version: Int` fixed to `1` and the same optional fields. `StorySlide` is already `Codable` in Swift (`StorySlide.swift`) — reuse it.

## 2. Validation (`serialize.ts`)

`deserializeDeck(json)` must reject anything that doesn't match this shape before returning it — mirror as a Swift decode step that throws on:
- `version !== 1`
- missing/empty `id`
- any slide missing its type's required fields (see `SLIDE_REQUIRED_FIELDS` in `serialize.ts` — this should already be covered for free by Swift's `Codable` conformance on `StorySlide`, since a missing required field will fail to decode).

The web side throws a named `InvalidDeckError` — use whatever idiomatic Swift error type fits (e.g. a `DeckManifestError` enum), the important part is *don't crash, don't silently accept malformed input*.

## 3. URL encoding scheme (`share.ts`) — must match exactly for cross-platform links to work

```
1. JSON.stringify(manifest)          → UTF-8 bytes
2. base64-encode those bytes         → standard base64
3. make it URL-safe:
     '+' → '-'
     '/' → '_'
     strip trailing '=' padding
4. put it in a query param named `deck`, e.g. https://example.com/deck?deck=<encoded>
```

Decoding reverses this: re-pad to a multiple of 4 with `=`, swap `-`/`_` back to `+`/`/`, base64-decode, UTF-8-decode, `JSON.parse`, then run the same validation as step 2.

Reference implementation (web, `packages/protocol/src/share.ts`):

```ts
function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/")
    .padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
```

Swift equivalent: `Data(base64Encoded:)` / `.base64EncodedString()` do the heavy lifting — just swap the alphabet characters and handle padding as above. Foundation's `Data` handles UTF-8 via `String(data:encoding:)`, no manual byte-juggling needed.

Suggested Swift API surface, matching the web function names 1:1 so the two SDKs read the same:

```swift
func serializeDeck(_ manifest: DeckManifest) -> String
func deserializeDeck(_ json: String) throws -> DeckManifest
func encodeDeckToParam(_ manifest: DeckManifest) -> String
func decodeDeckFromParam(_ param: String) throws -> DeckManifest
func buildShareURL(_ baseURL: URL, deck: DeckManifest) -> URL
func readDeckFromLocation(_ url: URL) throws -> DeckManifest?
```

## Verification once ported

Generate a share link on web (`buildShareURL` in the demo, "Share this deck" button) and confirm the iOS app's `decodeDeckFromParam`/`readDeckFromLocation` reconstructs the identical `DeckManifest` — and vice versa, generate one on iOS and paste it into the web demo's `?deck=` param. That round trip is the actual acceptance test; matching JSON shapes alone isn't sufficient proof since the URL-safe base64 step is where platform-specific bugs tend to hide (padding, `+`/`/` handling).
