from decimal import Decimal
import json
from django import http
from django.core.serializers.json import DjangoJSONEncoder
import resource
from dateutil import parser
from expense import get_expenses_query_set
from django.shortcuts import render


# @resource.user_authentication_required
def print_expenses(request):
    qs = get_expenses_query_set(request)
    data = {
        'items': list(qs),
    }
    return render(
        request,
        'app/print_expenses.html',
        data
    )
    return http.HttpResponse(content, status=200)
