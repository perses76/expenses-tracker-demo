import json
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from simple_rest import Resource

from .models import Expense


class ExpenseResource(Resource):
    def get(self, request, id=None, **kwargs):
        items = Expense.objects.all().values()
        items_json = json.dumps(list(items), cls=DjangoJSONEncoder)
        return HttpResponse(items_json, content_type='application/json', status=200)

    def post(self, request, *args, **kwargs):
        Contact.objects.create(
            fname=request.POST.get('fname'),
            lname=request.POST.get('lname'),
            phone_number=request.POST.get('phone_number'))
        return HttpResponse(status=201)

    def delete(self, request, id):
        contact = Contact.objects.get(pk=contact_id)
        contact.delete()
        return HttpResponse(status=200)