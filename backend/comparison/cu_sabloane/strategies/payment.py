"""Strategy pentru metodele de plată."""
from abc import ABC, abstractmethod


class PaymentStrategy(ABC):
    @abstractmethod
    def taxa(self, suma: float) -> float:
        raise NotImplementedError

    @property
    @abstractmethod
    def eticheta(self) -> str:
        raise NotImplementedError


class PlataCard(PaymentStrategy):
    eticheta = "Card bancar"

    def taxa(self, suma):
        return 0.0


class PlataRamburs(PaymentStrategy):
    eticheta = "Ramburs (la livrare)"

    def __init__(self, taxa_fixa: float = 5.0):
        self.taxa_fixa = taxa_fixa

    def taxa(self, suma):
        return self.taxa_fixa


class PlataKervenCard(PaymentStrategy):
    eticheta = "Card KERVEN"

    def __init__(self, bonus_procent: float = 2.0):
        self.bonus_procent = bonus_procent

    def taxa(self, suma):
        # bonus de loialitate
        return -suma * self.bonus_procent / 100.0
