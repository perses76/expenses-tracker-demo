from decimal import Decimal
import json
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from resource import Resource
from dateutil import parser
from django.contrib.auth import get_user_model
from ..serializers import user_to_dict


User = get_user_model()


class UserResource(Resource):
    def get(self, request, id=None):
        items = [user_to_dict(item) for item in User.objects.all()]
        items_json = json.dumps(items, cls=DjangoJSONEncoder)
        return HttpResponse(items_json, content_type='application/json', status=200)

    def post(self, request):
        data = json.loads(request.body)
        item = Expense(
            amount = Decimal(data['amount']),
            description = data['description'],
            comment = data['comment'],
            transaction_dt = parser.parse(data['transaction_dt'])
        )
        item.save()
        item = Expense.objects.get(id=item.id)
        items_json = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        return HttpResponse(items_json, status=200, content_type='application/json')

    def put(self, request, id):
        data = json.loads(request.body)
        item = Expense.objects.get(id=id)
        item.amount = Decimal(data['amount'])
        item.description = data['description']
        item.comment = data['comment']
        item.transaction_dt = parser.parse(data['transaction_dt'])
        item.save()
        item = Expense.objects.get(id=item.id)
        item_json = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        return HttpResponse(item_json, status=200, content_type='application/json')

    def delete(self, request, id):
        item = Expense.objects.get(pk=id)
        item_json = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        item.delete()
        return HttpResponse(item_json, status=200, content_type='application/json')