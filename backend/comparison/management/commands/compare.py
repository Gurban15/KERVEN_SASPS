"""python manage.py compare"""
from django.core.management.base import BaseCommand

from comparison import scenarios
from comparison.metrics import run_metrics


class Command(BaseCommand):
    help = "Verifică echivalența variantelor și afișează metricile comparative."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING(
            "1) Echivalență funcțională (fără șabloane vs cu șabloane)"))
        ok = scenarios.ruleaza()
        self.stdout.write("")
        self.stdout.write(self.style.MIGRATE_HEADING(
            "2) Metrici obiective (radon)"))
        run_metrics.ruleaza()
        if ok:
            self.stdout.write(self.style.SUCCESS("\nGata: variante echivalente, metrici salvate."))
        else:
            self.stdout.write(self.style.ERROR("\nVariante NEechivalente, verifică implementarea."))
