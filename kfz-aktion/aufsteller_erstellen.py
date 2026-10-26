"""Erstellt die QR-Aufsteller (A4, eine Seite pro Fahrschule) als PDF.

Aufruf:
    python3 aufsteller_erstellen.py qr-links.csv Aufsteller.pdf
    python3 aufsteller_erstellen.py --muster Aufsteller_Muster.pdf

qr-links.csv: Reiter „QR-Links“ aus der Antworten-Tabelle (Spalten: Fahrschule, Link).
Benötigt: pip install segno reportlab
"""
import csv
import io
import sys

import segno
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

NAVY = HexColor("#1F3864")
TEXT = HexColor("#262626")
GRAU = HexColor("#595959")
HELL = HexColor("#EEF2F8")

W, H = A4


def qr_bild(url):
    buf = io.BytesIO()
    segno.make(url, error="m").save(buf, kind="png", scale=20, border=2, dark="#1F3864")
    buf.seek(0)
    return ImageReader(buf)


def zentriert(c, text, y, font, size, color=TEXT):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawCentredString(W / 2, y, text)


def seite(c, fahrschule, url, muster=False):
    # Kopfband
    c.setFillColor(NAVY)
    c.rect(0, H - 62 * mm, W, 62 * mm, stroke=0, fill=1)
    zentriert(c, "Dein erstes Auto?", H - 30 * mm, "Helvetica-Bold", 40, white)
    zentriert(c, "Hol dir dein unverbindliches Angebot", H - 43 * mm, "Helvetica", 20, white)
    zentriert(c, "für die Kfz-Versicherung", H - 52 * mm, "Helvetica", 20, white)

    # QR-Code
    size = 95 * mm
    x, y = (W - size) / 2, H - 62 * mm - 16 * mm - size
    c.setFillColor(HELL)
    c.roundRect(x - 8 * mm, y - 8 * mm, size + 16 * mm, size + 16 * mm, 6 * mm, stroke=0, fill=1)
    c.drawImage(qr_bild(url), x, y, size, size)
    zentriert(c, "Scannen – 1 Minute – fertig", y - 17 * mm, "Helvetica-Bold", 18, NAVY)

    # Vorteile
    punkte = [
        "Kostenlos und unverbindlich",
        "Vergleich mehrerer Versicherer",
        "Tipps für Fahranfänger: Zweitwagen der Eltern, SF-Übernahme, BF17",
    ]
    yy = y - 32 * mm
    for p in punkte:
        c.setFillColor(NAVY)
        c.circle(32 * mm, yy + 1.6 * mm, 1.6 * mm, stroke=0, fill=1)
        c.setFillColor(TEXT)
        c.setFont("Helvetica", 14)
        c.drawString(37 * mm, yy, p)
        yy -= 9 * mm

    # Fußzeile
    c.setStrokeColor(HexColor("#BFBFBF"))
    c.line(25 * mm, 30 * mm, W - 25 * mm, 30 * mm)
    zentriert(c, "Kai Schindler · Finanzberater · tecis Pforzheim", 21 * mm, "Helvetica-Bold", 12, TEXT)
    zentriert(c, f"In Kooperation mit {fahrschule}", 14 * mm, "Helvetica", 10, GRAU)

    if muster:
        c.saveState()
        c.setFillColor(HexColor("#C00000"))
        c.setFillAlpha(0.18)
        c.translate(W / 2, H / 2)
        c.rotate(35)
        c.setFont("Helvetica-Bold", 90)
        c.drawCentredString(0, 0, "MUSTER")
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(0, -18 * mm, "QR-Code noch nicht aktiv – nicht drucken")
        c.restoreState()
    c.showPage()


def main():
    if len(sys.argv) == 3 and sys.argv[1] == "--muster":
        eintraege, muster, ziel = [("Fahrschule Muster", "https://example.com/muster")], True, sys.argv[2]
    elif len(sys.argv) == 3:
        with open(sys.argv[1], newline="", encoding="utf-8") as f:
            rows = list(csv.reader(f))
        eintraege = [(r[0].strip(), r[1].strip()) for r in rows[1:] if len(r) >= 2 and r[1].startswith("http")]
        muster, ziel = False, sys.argv[2]
    else:
        sys.exit(__doc__)
    c = canvas.Canvas(ziel, pagesize=A4)
    c.setTitle("Kfz-Aktion Fahrschulen – QR-Aufsteller")
    for name, url in eintraege:
        seite(c, name, url, muster)
    c.save()
    print(f"{len(eintraege)} Seite(n) → {ziel}")


if __name__ == "__main__":
    main()
