from decimal import Decimal
import json
from django import http
from django.core.serializers.json import DjangoJSONEncoder
import resource
from dateutil import parser
from expense import get_expenses_query_set
from django.shortcuts import render


def are_dates_equal(dt1, dt2):
    if dt1 is None or dt2 is None:
        return False
    return dt1.isocalendar()[1] == dt2.isocalendar()[1]


# @resource.user_authentication_required
def print_expenses(request):
    qs = get_expenses_query_set(request)
    expenses = qs.order_by('transaction_dt')

    # group expenses
    groups = []
    current_dt = None
    group = None
    for exp in expenses:
        if not are_dates_equal(current_dt, exp.transaction_dt):
            if group is not None:
                groups.append(group)
            group = {
                'transaction_dt': exp.transaction_dt,
                'expenses': []
            }
            current_dt = exp.transaction_dt
        group['expenses'].append(exp)
    if group is not None:
        groups.append(group)

    # calculate aggregates
    for g in groups:
        total = sum([exp.amount for exp in g['expenses']])
        g.update({'total': total, 'average': total / len(g['expenses'])})

    return render(
        request,
        'app/print_expenses.html',
        {'groups': groups}
    )
    return http.HttpResponse(content, status=200)
