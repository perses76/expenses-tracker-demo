from decimal import Decimal
import json
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
import resource
from dateutil import parser

from ..models import Expense


def get_expenses_query_set(request):
    qs = Expense.objects.filter(user=request.user)
    if 'q' in request.GET:
        qs = qs.filter(description__contains=request.GET['q'])
    return qs


class ExpenseResource(resource.Resource):
    @resource.user_authentication_required
    def get(self, request, id=None):
        qs = get_expenses_query_set(request)
        items = [item.to_dict() for item in qs]
        items_json = json.dumps(items, cls=DjangoJSONEncoder)
        return HttpResponse(items_json, content_type='application/json', status=200)

    @resource.user_authentication_required
    def post(self, request):
        data = json.loads(request.body)
        item = Expense(
            amount = Decimal(data['amount']),
            description = data['description'],
            comment = data['comment'],
            transaction_dt = parser.parse(data['transaction_dt']),
            user=request.user
        )
        item.save()
        item = Expense.objects.get(id=item.id)
        items_json = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        return HttpResponse(items_json, status=200, content_type='application/json')

    @resource.user_authentication_required
    def put(self, request, id):
        data = json.loads(request.body)
        item = Expense.objects.get(id=id, user=request.user)
        item.amount = Decimal(data['amount'])
        item.description = data['description']
        item.comment = data['comment']
        item.transaction_dt = parser.parse(data['transaction_dt'])
        item.save()
        item = Expense.objects.get(id=item.id)
        item_json = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        return HttpResponse(item_json, status=200, content_type='application/json')

    @resource.user_authentication_required
    def delete(self, request, id):
        item = Expense.objects.get(pk=id)
        item_json = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        item.delete()
        return HttpResponse(item_json, status=200, content_type='application/json')