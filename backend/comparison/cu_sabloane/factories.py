"""Factory: alege strategia potrivită după cod."""
from .strategies.discount import (
    DiscountStrategy,
    FaraReducere,
    ReducereProcent,
    ReducereFixa,
    ReducereBundle,
)
from .strategies.payment import (
    PaymentStrategy,
    PlataCard,
    PlataRamburs,
    PlataKervenCard,
)


def creeaza_reducere(cod: str) -> DiscountStrategy:
    if not cod or cod == "none":
        return FaraReducere()
    if cod.startswith("procent:"):
        return ReducereProcent(float(cod.split(":")[1]))
    if cod.startswith("fix:"):
        return ReducereFixa(float(cod.split(":")[1]))
    if cod == "bundle":
        return ReducereBundle()
    return FaraReducere()


_METODE = {
    "card": PlataCard,
    "ramburs": PlataRamburs,
    "kerven_card": PlataKervenCard,
}


def creeaza_plata(metoda: str) -> PaymentStrategy:
    clasa = _METODE.get(metoda, PlataRamburs)
    return clasa()
