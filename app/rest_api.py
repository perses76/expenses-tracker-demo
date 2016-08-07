from decimal import Decimal
import json
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from resource import Resource
from dateutil import parser

from .models import Expense


class ExpenseResource(Resource):
    def get(self, request, id=None):
        items = [item.to_dict() for item in Expense.objects.all()]
        items_json = json.dumps(items, cls=DjangoJSONEncoder)
        return HttpResponse(items_json, content_type='application/json', status=200)

    def post(self, request):
        data = json.loads(request.body)
        item = Expense(
            amount = Decimal(data['amount']),
            description = data['description'],
            comment = data['comment'],
            create_dt = parser.parse(data['create_dt'])
        )
        item.save()
        item = Expense.objects.get(id=item.id)
        items_json = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        return HttpResponse(items_json, status=200)

    def put(self, request, id):
        data = json.loads(request.body)
        item = Expense.objects.get(id=id)
        item.amount = Decimal(data['amount'])
        item.description = data['description']
        item.comment = data['comment']
        item.create_dt = parser.parse(data['create_dt'])
        item.save()
        item = Expense.objects.get(id=item.id)
        item_json = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        return HttpResponse(item_json, status=200)

    def delete(self, request, id):
        item = Expense.objects.get(pk=id)
        item_json = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        item.delete()
        return HttpResponse(item_json, status=200)