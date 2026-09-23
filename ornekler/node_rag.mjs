// Numex API — embeddings ile basit anlamsal arama (RAG'in "R"si)
// Kullanım: NUMEX_API_KEY=nx_live_... node node_rag.mjs
const BASE = 'https://www.numexai.com.tr/api/v1';
const headers = {
  Authorization: `Bearer ${process.env.NUMEX_API_KEY}`,
  'Content-Type': 'application/json',
};

const belgeler = [
  'Kira sözleşmesi, kiracı tarafından 15 gün önceden yazılı bildirimle feshedilebilir.',
  'Depozito, taşınmaz hasarsız teslim edildiğinde 30 gün içinde iade edilir.',
  'Aidat ödemeleri her ayın 5\'ine kadar yönetim hesabına yatırılır.',
];

async function embed(input) {
  const r = await fetch(`${BASE}/embeddings`, { method: 'POST', headers, body: JSON.stringify({ input }) });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  const { embeddings } = await r.json(); // { embeddings: number[][], dimensions, count }
  return embeddings;
}

const kosinus = (a, b) => {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2; }
  return d / (Math.sqrt(na) * Math.sqrt(nb));
};

const soru = 'Depozitomu ne zaman geri alırım?';
const [soruVek, ...belgeVek] = await embed([soru, ...belgeler]);
const sirali = belgeler
  .map((metin, i) => ({ metin, skor: kosinus(soruVek, belgeVek[i]) }))
  .sort((a, b) => b.skor - a.skor);

console.log(`Soru: ${soru}\n`);
for (const { metin, skor } of sirali) console.log(`${skor.toFixed(3)}  ${metin}`);
