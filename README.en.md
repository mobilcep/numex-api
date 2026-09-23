<div align="center">

<img src="gorseller/api-banner.png" alt="Numex API" width="100%">

# Numex API

### Add Turkish-first AI to your apps.

[🇹🇷 Türkçe](README.md) · 🇬🇧 **English**

</div>

---

The Numex API gives you [Numex AI](https://numexai.com.tr)'s models — wrapped in a pipeline that turns
every answer into natural, high-quality Turkish. Chat, agentic tool use, vision/OCR, image generation,
embeddings and web search behind one key. **100,000 free tokens** on sign-up, no card required.

## Quick start

```bash
curl https://www.numexai.com.tr/api/v1/chat \
  -H "Authorization: Bearer $NUMEX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"Merhaba!","history":[],"maxOutputTokens":512}'
```

→ `{ "success": true, "answer": "...", "modelLabel": "Numex Pro", "usage": { ... } }`

Auth: `Authorization: Bearer nx_live_...` or `x-api-key: nx_live_...`. Keys are shown once; rotate
them from the Numex dashboard. Never ship a key in browser code.

## Models

| Model | Context | Max out | Notes | Input / 1M | Output / 1M |
|---|---|---|---|---|---|
| `numex-pro` | 128K | 4K | Most capable; vision, function calling | ₺30 | ₺250 |
| `numex-fast` | 32K | 4K | ~3× faster, cheapest | ₺15 | ₺30 |
| `numex-think` | 128K | 8K | Deep reasoning (chain-of-thought) | ₺45 | ₺90 |
| `numex-code` | 64K | 8K | Code, 25+ languages | ₺30 | ₺85 |
| `numex-vision` | — | — | Image → text, OCR | ₺100 per image | — |

## Endpoints (`https://www.numexai.com.tr/api/v1`)

`POST /chat` · `POST /chat/stream` · `POST /chat/agent` (tools with `input_schema`) · `POST /vision` ·
`POST /images/generations` · `POST /embeddings` (≤128 texts) · `POST /search` · `GET /models` ·
`GET /features` · `GET /usage`

Full reference (Turkish, with request/response examples): [docs/uc-noktalar.md](docs/uc-noktalar.md)

## Pricing & limits

Pay-as-you-go token packs that **never expire**: Starter ₺499 (5M) · Growth ₺1,499 (20M) ·
Scale ₺3,499 (50M). Rate limits scale automatically with spend: Free 10 req/min → Tier 3 500 req/min.

## SDK & examples

- Node.js/TypeScript: [numex-sdk](https://github.com/mobilcep/numex-sdk)
- Python, cURL and an embeddings-based semantic search demo: [`ornekler/`](ornekler/)

Support: **destek@numexai.com.tr**
