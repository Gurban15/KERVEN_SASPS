"""Service Layer: procesează comanda folosind șabloanele."""
from . import factories
from .observers import (
    ComandaSubject,
    NotificareEmail,
    NotificareSms,
    ActualizareStoc,
)
from .repositories import InMemoryOrderRepository

TRANSPORT_GRATUIT_PESTE = 200.0
TAXA_TRANSPORT = 15.0


class OrderService:
    def __init__(self, repository=None, subject=None):
        self.repository = repository or InMemoryOrderRepository()
        self.subject = subject or self._subject_implicit()

    @staticmethod
    def _subject_implicit():
        s = ComandaSubject()
        s.ataseaza(NotificareEmail())
        s.ataseaza(NotificareSms())
        s.ataseaza(ActualizareStoc())
        return s

    @staticmethod
    def _subtotal(items):
        subtotal = sum(float(it["price"]) * int(it["qty"]) for it in items)
        nr = sum(int(it["qty"]) for it in items)
        return subtotal, nr

    @staticmethod
    def _transport(suma):
        return 0.0 if suma >= TRANSPORT_GRATUIT_PESTE else TAXA_TRANSPORT

    def proceseaza(self, items, discount_code, payment_method):
        subtotal, nr_articole = self._subtotal(items)

        reducere = factories.creeaza_reducere(discount_code).calculeaza(
            subtotal, nr_articole
        )
        dupa_reducere = subtotal - reducere

        taxa_plata = factories.creeaza_plata(payment_method).taxa(dupa_reducere)
        transport = self._transport(dupa_reducere)

        total = max(0.0, dupa_reducere + taxa_plata + transport)

        notificari = self.subject.notifica({"total": total, "items": items})
        # stocul poate avea mai multe linii
        notificari = [l for grup in notificari for l in grup.split("\n")]

        rezultat = {
            "subtotal": round(subtotal, 2),
            "reducere": round(reducere, 2),
            "taxa_plata": round(taxa_plata, 2),
            "transport": round(transport, 2),
            "total": round(total, 2),
            "status": "paid",
            "notificari": notificari,
        }
        self.repository.salveaza(dict(rezultat, items=items))
        return rezultat


def proceseaza_comanda(items, discount_code, payment_method):
    # aceeași semnătură ca în varianta A
    return OrderService().proceseaza(items, discount_code, payment_method)
