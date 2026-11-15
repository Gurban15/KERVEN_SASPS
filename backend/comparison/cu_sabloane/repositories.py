"""Repository: salvarea comenzilor (în memorie sau în baza de date)."""
from abc import ABC, abstractmethod


class OrderRepository(ABC):
    @abstractmethod
    def salveaza(self, comanda: dict) -> int:
        raise NotImplementedError

    @abstractmethod
    def get(self, order_id: int) -> dict:
        raise NotImplementedError


class InMemoryOrderRepository(OrderRepository):
    def __init__(self):
        self._date = {}
        self._next = 1

    def salveaza(self, comanda):
        oid = self._next
        self._date[oid] = dict(comanda, id=oid)
        self._next += 1
        return oid

    def get(self, order_id):
        return self._date.get(order_id)


class DjangoOrderRepository(OrderRepository):
    def salveaza(self, comanda):
        from orders.models import Order, OrderItem

        o = Order.objects.create(
            full_name=comanda.get("client", ""),
            status=comanda.get("status", "new"),
        )
        for it in comanda.get("items", []):
            OrderItem.objects.create(
                order=o, name=it.get("name", ""),
                price=it["price"], qty=it["qty"],
            )
        return o.pk

    def get(self, order_id):
        from orders.models import Order

        o = Order.objects.filter(pk=order_id).first()
        return None if o is None else {"id": o.pk, "status": o.status}
