# 📚 Numex API — Uç Nokta Referansı

**Base URL:** `https://www.numexai.com.tr/api/v1`
**Kimlik:** `Authorization: Bearer nx_live_...` veya `x-api-key: nx_live_...`
**Gövde:** `Content-Type: application/json`

Tüm yapay zekâ uç noktaları çağrı başına token bakiyenden düşer; bakiye yetmezse `402
insufficient_tokens` döner.

---

## `POST /chat`

Tek bir mesaj ve isteğe bağlı sohbet geçmişiyle yanıt üretir. Yanıt Numex **Pipeline**'ından geçer.

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `message` | string | ✅ | Kullanıcının mesajı |
| `history` | array | — | Önceki mesajlar: `[{ "role": "user"\|"assistant", "content": "..." }]` |
| `model` | string | — | `numex-pro`, `numex-fast`, `numex-think`, `numex-code` (planına göre) |
| `maxOutputTokens` | number | — | 32–8192, varsayılan 4096 |

**İstek**
```json
{
  "message": "Bu fonksiyonu açıkla: const f = n => n < 2 ? n : f(n-1) + f(n-2)",
  "history": [],
  "model": "numex-code",
  "maxOutputTokens": 1024
}
```

**Yanıt `200`**
```json
{
  "success": true,
  "answer": "Bu, özyinelemeli bir Fibonacci fonksiyonudur…",
  "modelProfile": "code",
  "modelLabel": "Numex Code",
  "usage": {
    "estimatedInputTokens": 24,
    "estimatedOutputTokens": 180,
    "estimatedTotalTokens": 204,
    "billedTokens": 204,
    "multiplier": 1
  }
}
```

---

## `POST /chat/stream`

`/chat` ile aynı gövde; yanıt **Server-Sent Events** olarak parça parça gelir.

```bash
curl -N https://www.numexai.com.tr/api/v1/chat/stream \
  -H "Authorization: Bearer $NUMEX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"Türkiye ekonomisi hakkında kısa bir analiz yaz"}'
```

> Not: Sitedeki örnekler şu an tam yanıt döndüren `/chat` kullanıyor; akışlı yanıta ihtiyacın yoksa
> `/chat` ile başla.

---

## `POST /chat/agent`

Araç kullanan (function calling), çok adımlı ajan çağrısı. OpenAI tarzı `messages` dizisi alır.

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `messages` | array | ✅ | `[{ "role": "system"\|"user"\|"assistant"\|"tool", "content": ... }]` |
| `tools` | array | — | JSON Schema ile tanımlı araçlar |
| `system` | string | — | Sistem talimatı |
| `mode` / `agentMode` | string | — | Ajan modu |
| `model` | string | — | Model |
| `maxOutputTokens` | number | — | Çıktı sınırı |

```json
{
  "messages": [{ "role": "user", "content": "İstanbul'da yarın hava nasıl olacak?" }],
  "tools": [{
    "name": "hava_durumu",
    "description": "Bir şehir için hava tahmini döner",
    "input_schema": {
      "type": "object",
      "properties": { "sehir": { "type": "string" }, "gun": { "type": "string" } },
      "required": ["sehir"]
    }
  }]
}
```

---

## `POST /vision`

Görsel analizi, açıklama ve OCR.

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `image` | string | ✅ | Görsel URL'si **veya** Base64 |
| `prompt` | string | — | Görselle ilgili soru / talimat |

```json
{ "image": "https://ornek.com/fatura.jpg", "prompt": "Bu faturadaki toplam tutarı ve tarihi çıkar" }
```

Hatalar: `400 image alanı (URL veya Base64) zorunludur` · `400 Görsel indirilemedi: …`

---

## `POST /images/generations`

Metinden görsel üretir.

```json
{ "prompt": "Kapadokya'da gün doğumu, sıcak hava balonları, sinematik" }
```

Hata: `400 Geçersiz görsel isteği`

---

## `POST /embeddings`

Metinleri vektöre çevirir — anlamsal arama, RAG, sınıflandırma, kümeleme için.

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `input` | string \| string[] | ✅ | Tek metin ya da metin dizisi (`inputs`, `texts` da kabul edilir) |

- Tek istekte **en fazla 128 metin**.

```json
{ "input": ["Kira sözleşmesi nasıl feshedilir?", "Depozito iadesi ne zaman yapılır?"] }
```

**Yanıt:** `{ "success": true, "embeddings": [[0.012, -0.08, …], […]], "dimensions": <vektör boyutu>, "count": 2 }`
(`dimensions` modele göre değişir.)

Hatalar: `400 input (metin veya metin dizisi) zorunludur` · `400 En fazla 128 metin gönderilebilir`

---

## `POST /search`

Web'de arar, kaynakları başlık, bağlantı ve kısa özetle döner.

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `query` | string | ✅ | Arama sorgusu (`sorgu` da kabul edilir) |
| `num` | number | — | Kaynak sayısı, 1–10 (varsayılan 5; `limit` da kabul edilir) |

```json
{ "query": "2026 asgari ücret", "num": 5 }
```

Yanıttaki her kaynak: `{ "title": "...", "link": "...", "snippet": "..." }`

Hatalar: `400 query zorunludur` · `502 Web araması şu an yapılamadı.`

---

## `GET /models`

Hesabının kullanabildiği modelleri listeler.

## `GET /features`

Anahtarına bağlı planda hangi yeteneklerin açık olduğunu döner: `{ "success": true, "features": {...} }`.
Entegrasyona başlamadan önce kontrol etmen önerilir.

---

## Hesap ve kullanım

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/me` · `/account` | Hesap bilgisi ve token bakiyesi |
| `GET` | `/usage` | Güncel kullanım |
| `GET` | `/usage/history` | Kullanım geçmişi |
| `GET` | `/payments` | Ödeme geçmişi |
| `GET` | `/me/models` | Tercih edilebilir modeller |
| `POST` | `/me/preferred-model` | Varsayılan modeli ayarla |
| `POST` | `/me/test-key` | Anahtarı test et |

Anahtar yönetimi (oluşturma, döndürme, silme) ve paket satın alma **Numex paneli** üzerinden yapılır.

---
← [Ana sayfa](../README.md)
