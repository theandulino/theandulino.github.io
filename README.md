# Developer-Webseite

Persönliche Developer-Webseite von **theandulino**, gehostet auf GitHub Pages.
Reines HTML/CSS/JS – kein Build-Schritt nötig.

## Inhalte anpassen

- **Texte** (Hero, Über mich, Stack, Kontakt): `index.html`
- **Farben & Schriften**: Variablen ganz oben in `style.css` (`--accent` usw.)
- **Projekte**: werden automatisch aus den öffentlichen GitHub-Repos geladen.
  Einstellungen (Benutzername, Anzahl, ausgeblendete Repos) oben in `script.js`.

## Veröffentlichen

Ziel-URL: **https://theandulino.github.io/**

1. Repo auf GitHub umbenennen in **`theandulino.github.io`**
   (Repo → **Settings → General → Repository name**). Nur ein Repo mit genau diesem
   Namen wird unter der Root-Domain ausgeliefert.
2. Lokale Remote-URL anpassen:
   `git remote set-url origin https://github.com/theandulino/theandulino.github.io.git`
3. Pushen. Unter **Settings → Pages** sicherstellen:
   *Source: Deploy from a branch → `main` / `/ (root)`*.
4. Nach ca. 1 Minute ist die Seite unter https://theandulino.github.io/ online.

## Lokal ansehen

`index.html` einfach im Browser öffnen.
