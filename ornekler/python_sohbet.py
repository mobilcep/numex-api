"""Numex API — Python ile çok turlu sohbet örneği.

Kurulum:  pip install requests
Kullanım: NUMEX_API_KEY=nx_live_... python python_sohbet.py
"""
import os
import requests

BASE = "https://www.numexai.com.tr/api/v1"
HEADERS = {"Authorization": f"Bearer {os.environ['NUMEX_API_KEY']}"}


def sor(mesaj, gecmis, model="numex-pro"):
    r = requests.post(
        f"{BASE}/chat",
        headers=HEADERS,
        json={"message": mesaj, "history": gecmis, "model": model, "maxOutputTokens": 1024},
        timeout=120,
    )
    if r.status_code == 402:
        raise SystemExit("Token bakiyesi yetersiz — numexai.com.tr/api üzerinden paket yükleyin.")
    r.raise_for_status()
    return r.json()


def main():
    gecmis = []
    print("Numex ile sohbet (çıkmak için boş satır)\n")
    while True:
        mesaj = input("Sen: ").strip()
        if not mesaj:
            break
        yanit = sor(mesaj, gecmis)
        cevap = yanit.get("answer", "")
        print(f"\nNumex ({yanit.get('modelLabel', '')}): {cevap}\n")
        gecmis += [{"role": "user", "content": mesaj}, {"role": "assistant", "content": cevap}]


if __name__ == "__main__":
    main()
