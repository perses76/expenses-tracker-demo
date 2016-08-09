from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User


class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Amount', null=False)
    description = models.CharField(max_length=1000, null=False, blank=True)
    comment = models.TextField(null=False, blank=True)
    transaction_dt = models.DateTimeField(null=False)
    user = models.ForeignKey(to=User)

    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'description': self.description,
            'comment': self.comment,
            'transaction_dt': self.transaction_dt
        }