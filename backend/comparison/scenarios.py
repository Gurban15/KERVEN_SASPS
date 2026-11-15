"""Verifică dacă variantele A și B dau același rezultat.

Rulare: python -m comparison.scenarios
"""
from comparison.fara_sabloane import monolit
from comparison.cu_sabloane import services

SCENARII = [
    {
        "nume": "Coș mic, procent 10%, card",
        "items": [{"name": "Monitor", "price": 868, "qty": 1}],
        "discount": "procent:10",
        "payment": "card",
    },
    {
        "nume": "Bundle 3 articole, ramburs",
        "items": [
            {"name": "Căști", "price": 244, "qty": 1},
            {"name": "Cafea", "price": 81, "qty": 1},
            {"name": "Mouse", "price": 120, "qty": 1},
        ],
        "discount": "bundle",
        "payment": "ramburs",
    },
    {
        "nume": "Reducere fixă 50, Card KERVEN",
        "items": [{"name": "Laptop", "price": 2379, "qty": 1}],
        "discount": "fix:50",
        "payment": "kerven_card",
    },
    {
        "nume": "Fără reducere, sub prag transport",
        "items": [{"name": "Tricou", "price": 99, "qty": 1}],
        "discount": "none",
        "payment": "card",
    },
]


def ruleaza():
    toate_ok = True
    for sc in SCENARII:
        a = monolit.proceseaza_comanda(sc["items"], sc["discount"], sc["payment"])
        b = services.proceseaza_comanda(sc["items"], sc["discount"], sc["payment"])
        ok = a == b
        toate_ok = toate_ok and ok
        print(("[OK] " if ok else "[DIFERIT] ") + sc["nume"] + " -> total %.2f Lei" % a["total"])
        if not ok:
            print("   A:", a)
            print("   B:", b)
    print()
    print("Rezultat: " + ("toate identice, variante echivalente funcțional."
                          if toate_ok else "ATENȚIE: rezultate diferite!"))
    return toate_ok


if __name__ == "__main__":
    import os
    import sys

    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    raise SystemExit(0 if ruleaza() else 1)
