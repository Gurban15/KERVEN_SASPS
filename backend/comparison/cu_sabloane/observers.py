"""Observer: notificări după plasarea comenzii."""
from abc import ABC, abstractmethod


class Observer(ABC):
    @abstractmethod
    def actualizeaza(self, eveniment: dict) -> str:
        raise NotImplementedError


class ComandaSubject:
    def __init__(self):
        self._observatori = []

    def ataseaza(self, observator: Observer):
        self._observatori.append(observator)

    def notifica(self, eveniment: dict) -> list:
        return [o.actualizeaza(eveniment) for o in self._observatori]


class NotificareEmail(Observer):
    def actualizeaza(self, ev):
        return "email: Comanda confirmată, total %.2f Lei" % ev["total"]


class NotificareSms(Observer):
    def actualizeaza(self, ev):
        return "sms: Comanda ta KERVEN a fost plătită (%.2f Lei)" % ev["total"]


class ActualizareStoc(Observer):
    def actualizeaza(self, ev):
        linii = [
            "stoc: -%d x %s" % (int(it["qty"]), it.get("name", "produs"))
            for it in ev["items"]
        ]
        return "\n".join(linii)
