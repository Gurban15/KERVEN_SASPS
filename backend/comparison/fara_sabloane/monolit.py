"""Varianta A: fără șabloane. Toată comanda e procesată într-o singură funcție."""

TRANSPORT_GRATUIT_PESTE = 200.0
TAXA_TRANSPORT = 15.0


def proceseaza_comanda(items, discount_code, payment_method):
    # 1. subtotal
    subtotal = 0.0
    for it in items:
        subtotal += float(it["price"]) * int(it["qty"])
    nr_articole = sum(int(it["qty"]) for it in items)

    # 2. reducere
    reducere = 0.0
    if discount_code is None or discount_code == "none" or discount_code == "":
        reducere = 0.0
    elif discount_code.startswith("procent:"):
        try:
            p = float(discount_code.split(":")[1])
        except (IndexError, ValueError):
            p = 0.0
        if p < 0:
            p = 0.0
        if p > 90:
            p = 90.0
        reducere = subtotal * p / 100.0
    elif discount_code.startswith("fix:"):
        try:
            f = float(discount_code.split(":")[1])
        except (IndexError, ValueError):
            f = 0.0
        if f < 0:
            f = 0.0
        if f > subtotal:
            f = subtotal
        reducere = f
    elif discount_code == "bundle":
        # 10% de la 3 articole
        if nr_articole >= 3:
            reducere = subtotal * 0.10
        else:
            reducere = 0.0
    else:
        reducere = 0.0

    dupa_reducere = subtotal - reducere

    # 3. taxa de plată
    taxa_plata = 0.0
    if payment_method == "card":
        taxa_plata = 0.0
    elif payment_method == "ramburs":
        taxa_plata = 5.0
    elif payment_method == "kerven_card":
        # 2% bonus de loialitate
        taxa_plata = -dupa_reducere * 0.02
    else:
        taxa_plata = 5.0

    # 4. transport
    if dupa_reducere >= TRANSPORT_GRATUIT_PESTE:
        transport = 0.0
    else:
        transport = TAXA_TRANSPORT

    total = dupa_reducere + taxa_plata + transport
    if total < 0:
        total = 0.0

    # 5. status și notificări
    status = "paid"
    notificari = []
    # email
    notificari.append(
        "email: Comanda confirmată, total %.2f Lei" % total
    )
    # sms
    notificari.append(
        "sms: Comanda ta KERVEN a fost plătită (%.2f Lei)" % total
    )
    # actualizare stoc
    for it in items:
        notificari.append(
            "stoc: -%d x %s" % (int(it["qty"]), it.get("name", "produs"))
        )

    return {
        "subtotal": round(subtotal, 2),
        "reducere": round(reducere, 2),
        "taxa_plata": round(taxa_plata, 2),
        "transport": round(transport, 2),
        "total": round(total, 2),
        "status": status,
        "notificari": notificari,
    }
