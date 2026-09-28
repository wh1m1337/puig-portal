# PUIG portal — koncept

Koncepcyjny prototyp nowego portalu Polsko-Ukraińskiej Izby Gospodarczej, przygotowany na podstawie analizy [pol-ukr.com](https://pol-ukr.com/) (28.09.2026). Treści (usługi, ceny, wydarzenia, składki, kontakty, kierownictwo) pochodzą z obecnej strony.

## Strony

| Plik | Zawartość |
|---|---|
| `index.html` | Strona główna: trzy ścieżki (UA→PL, PL→UA, odbudowa), liczby, zapowiedzi usług/wydarzeń/aktualności |
| `o-izbie.html` | Misja, cele, Komisja Międzyrządowa, kierownictwo i Rada, dokumenty |
| `uslugi.html` | 9 usług z cenami „od”, proces współpracy, formularz |
| `wydarzenia.html` | Kalendarz z filtrem i eksportem .ics |
| `czlonkostwo.html` | Pakiety wg Uchwały 2/2026, kalkulator składki, kroki |
| `czlonkowie.html` | Katalog firm z wyszukiwarką i filtrami branż |
| `aktualnosci.html` | Aktualności Izby i firm członkowskich |
| `odbudowa.html` | Odbudowa Ukrainy: Ukraine Facility, webinary, konferencje |
| `kontakt.html` | Formularz z wyborem działu, sieć 26 biur |

PL / UA / EN, jasny i ciemny motyw, responsywny układ, bez frameworków.

## Struktura

- `build.py` — generuje wszystkie strony HTML ze wspólnego szablonu (`python3 build.py`)
- `assets/style.css` — style i motywy
- `assets/data.js` — treści i tłumaczenia
- `assets/app.js` — nagłówek, stopka, renderowanie sekcji, język, motyw

Podgląd lokalny: `python3 -m http.server` w katalogu projektu.

## Ograniczenia prototypu

- Formularz kontaktowy otwiera klienta poczty (mailto) — w produkcji potrzebny backend.
- Katalog członków zawiera 20 firm z ogłoszeń Izby; przypisanie branż jest orientacyjne.
- Logo jest tymczasowe.
