"""Strategy pentru reduceri."""
from abc import ABC, abstractmethod


class DiscountStrategy(ABC):
    @abstractmethod
    def calculeaza(self, subtotal: float, nr_articole: int) -> float:
        raise NotImplementedError


class FaraReducere(DiscountStrategy):
    def calculeaza(self, subtotal, nr_articole):
        return 0.0


class ReducereProcent(DiscountStrategy):
    def __init__(self, procent: float):
        self.procent = max(0.0, min(procent, 90.0))

    def calculeaza(self, subtotal, nr_articole):
        return subtotal * self.procent / 100.0


class ReducereFixa(DiscountStrategy):
    def __init__(self, suma: float):
        self.suma = max(0.0, suma)

    def calculeaza(self, subtotal, nr_articole):
        return min(self.suma, subtotal)


class ReducereBundle(DiscountStrategy):
    def __init__(self, prag: int = 3, procent: float = 10.0):
        self.prag = prag
        self.procent = procent

    def calculeaza(self, subtotal, nr_articole):
        if nr_articole >= self.prag:
            return subtotal * self.procent / 100.0
        return 0.0
