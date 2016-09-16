from decimal import Decimal
import json
from django import http
from django.core.serializers.json import DjangoJSONEncoder
import resource
from dateutil import parser
from expense import get_expenses_query_set
from django.shortcuts import render
from django.contrib.auth import get_user_model
import resource

User = get_user_model()


def are_dates_equal(dt1, dt2):
    if dt1 is None or dt2 is None:
        return False
    return dt1.isocalendar()[1] == dt2.isocalendar()[1]


def get_group_caption(dt):
    year, week, weekday = dt.isocalendar()
    return '{week} week, {year}'.format(year=year, week=week)


@resource.user_authentication_required
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
                'caption': get_group_caption(exp.transaction_dt),
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
    
    user = request.user
    if 'user' in request.GET:
        user_id = long(request.GET['user'])
        user = User.objects.get(id=user_id)

    return render(
        request,
        'app/print_expenses.html',
        {'groups': groups, 'user': user}
    )
    return http.HttpResponse(content, status=200)
