from decimal import Decimal
import json
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from resource import Resource
from dateutil import parser

from .models import Expense


class ExpenseResource(Resource):
    def get(self, request, id=None, **kwargs):
        items = [item.to_dict() for item in Expense.objects.all()]
        items_json = json.dumps(items, cls=DjangoJSONEncoder)
        return HttpResponse(items_json, content_type='application/json', status=200)

    def post(self, request, *args, **kwargs):
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

    def delete(self, request, id):
        contact = Contact.objects.get(pk=contact_id)
        contact.delete()
        return HttpResponse(status=200)