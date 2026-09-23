#!/usr/bin/env bash
# Numex API — cURL örnekleri
# Kullanım: export NUMEX_API_KEY=nx_live_... && bash curl.sh
set -euo pipefail
BASE="https://www.numexai.com.tr/api/v1"
AUTH="Authorization: Bearer ${NUMEX_API_KEY:?NUMEX_API_KEY tanımlı değil}"

echo "== Sohbet"
curl -s "$BASE/chat" -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"message":"Bana 3 maddede Numex nedir anlat","history":[],"maxOutputTokens":512}'
echo

echo "== Web araması"
curl -s "$BASE/search" -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"query":"yapay zeka KVKK","num":3}'
echo

echo "== Embedding"
curl -s "$BASE/embeddings" -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"input":["merhaba dünya","selam evren"]}' | head -c 300
echo

echo "== Açık yetenekler"
curl -s "$BASE/features" -H "$AUTH"
echo
