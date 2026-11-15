# comparison — experimentul SASPS (cu vs fără șabloane)

Compară aceeași funcționalitate de **procesare a comenzii** KERVEN în două
variante, pe măsurători obiective.

## Structură
- `fara_sabloane/monolit.py` — Varianta A: totul într-o funcție, if/elif hardcodat.
- `cu_sabloane/` — Varianta B, cu șabloane:
  - `strategies/discount.py`, `strategies/payment.py` — **Strategy**
  - `factories.py` — **Factory**
  - `observers.py` — **Observer** (email/SMS/stoc)
  - `repositories.py` — **Repository** (acces la date izolat)
  - `services.py` — **Service layer** (orchestrare)
- `scenarios.py` — dovada că ambele variante dau exact același rezultat.
- `metrics/run_metrics.py` — CC, MI, LOC (radon) + efort de schimbare.

## Rulare
```
python manage.py compare          # echivalență + metrici
python -m comparison.scenarios    # doar echivalența
python -m comparison.metrics.run_metrics
```

## Ipoteze verificate
- **H1** — mai puține linii de cod existent modificate la o schimbare (risc de regresie mic).
- **H2** — complexitate ciclomatică mai mică, mentenabilitate (MI) mai mare.
- **H3** — cuplare mai scăzută (logica e separată pe componente mici).
