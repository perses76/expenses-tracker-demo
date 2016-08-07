# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-08-05 10:24
from __future__ import unicode_literals

from django.db import migrations
import datetime
from app.utils import UTC


def insert_expenes_test_data(apps, schema_editor):
    Expense = apps.get_model("app", "Expense")
    dt = datetime.datetime(2016, 8, 6, 10, 20, 15, tzinfo=UTC())
    Expense(
        amount=10.15, description='First record', comment='First Comment', transaction_dt=dt
        ).save()
    dt = datetime.datetime(2016, 8, 7, 14, 20, 15, tzinfo=UTC())
    Expense(
        amount=50.0, description='I spent 50 euros', comment='I dont know how I spent 50 euros', transaction_dt=dt
        ).save()


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(insert_expenes_test_data),
    ]


