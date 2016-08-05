"""
Definition of models.
"""

from django.db import models

# Create your models here.
class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Amount', null=False)
    description = models.CharField(max_length=1000, null=False, blank=True)
    comment = models.TextField(null=False, blank=True)
    create_dt = models.DateTimeField(auto_now_add=True, null=False)