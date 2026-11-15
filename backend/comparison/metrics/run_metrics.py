"""Metrici cu radon pentru cele două variante.

Rulare: python -m comparison.metrics.run_metrics
"""
import json
import os

from radon.complexity import cc_visit
from radon.metrics import mi_visit
from radon.raw import analyze

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

VARIANTE = {
    "fara_sabloane": os.path.join(BASE, "fara_sabloane"),
    "cu_sabloane": os.path.join(BASE, "cu_sabloane"),
}


def _fisiere_py(folder):
    out = []
    for root, _dirs, files in os.walk(folder):
        for f in files:
            if f.endswith(".py") and f != "__init__.py":
                out.append(os.path.join(root, f))
    return out


def masoara(folder):
    fisiere = _fisiere_py(folder)
    cc_total, nr_functii = 0, 0
    mi_valori = []
    loc, importuri = 0, 0
    for path in fisiere:
        with open(path, encoding="utf-8") as fh:
            cod = fh.read()
        for bloc in cc_visit(cod):
            cc_total += bloc.complexity
            nr_functii += 1
        mi_valori.append(mi_visit(cod, multi=True))
        raw = analyze(cod)
        loc += raw.lloc
        importuri += sum(
            1 for ln in cod.splitlines()
            if ln.strip().startswith(("import ", "from "))
        )
    return {
        "fisiere": len(fisiere),
        "loc": loc,
        "nr_functii": nr_functii,
        "cc_mediu": round(cc_total / nr_functii, 2) if nr_functii else 0,
        "mi": round(sum(mi_valori) / len(mi_valori), 1) if mi_valori else 0,
        "importuri_interne": importuri,
    }


def efort_schimbare():
    # câte linii existente schimbăm ca să adăugăm o reducere nouă (estimare)
    return {
        "fara_sabloane": {
            "fisiere_atinse": 1,
            "linii_existente_modificate": 12,
            "detaliu": "se modifică funcția proceseaza_comanda",
        },
        "cu_sabloane": {
            "fisiere_atinse": 2,
            "linii_existente_modificate": 1,
            "detaliu": "o clasă nouă în discount.py și o linie în factories.py",
        },
    }


def ruleaza():
    rezultate = {v: masoara(p) for v, p in VARIANTE.items()}
    rezultate["efort_schimbare"] = efort_schimbare()

    a, b = rezultate["fara_sabloane"], rezultate["cu_sabloane"]
    antet = "{:<26}{:>16}{:>16}".format("Metrică", "Fără șabloane", "Cu șabloane")
    print(antet)
    print("-" * len(antet))
    rand = "{:<26}{:>16}{:>16}"
    print(rand.format("Fișiere", a["fisiere"], b["fisiere"]))
    print(rand.format("LOC (linii logice)", a["loc"], b["loc"]))
    print(rand.format("Funcții/metode", a["nr_functii"], b["nr_functii"]))
    print(rand.format("CC mediu/funcție ↓", a["cc_mediu"], b["cc_mediu"]))
    print(rand.format("Mentenabilitate (MI) ↑", a["mi"], b["mi"]))
    print(rand.format("Linii existente modif. ↓",
                      rezultate["efort_schimbare"]["fara_sabloane"]["linii_existente_modificate"],
                      rezultate["efort_schimbare"]["cu_sabloane"]["linii_existente_modificate"]))
    print()
    print("↓ = mai mic e mai bine   ↑ = mai mare e mai bine")

    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rezultate.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(rezultate, fh, ensure_ascii=False, indent=2)
    print("\nSalvat: " + out)
    return rezultate


if __name__ == "__main__":
    ruleaza()
