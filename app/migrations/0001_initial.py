# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-08-05 10:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name=b'Amount')),
                ('description', models.CharField(blank=True, max_length=1000)),
                ('comment', models.TextField(blank=True)),
                ('transaction_dt', models.DateTimeField()),
            ],
        ),
    ]
