from decimal import Decimal
import json
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth import get_user_model
import resource
from dateutil import parser
from ..models import Expense


User = get_user_model()


def get_expenses_query_set(request):
    qs = Expense.objects.all()
    if 'q' in request.GET:
        qs = qs.filter(description__contains=request.GET['q'])
    current_user = request.user
    if 'user' in request.GET:
        user_id = long(request.GET['user'])
        user = User.objects.get(id=user_id)
        if user.id == current_user.id or current_user.is_superuser:
            qs = qs.filter(user=user)
        else:
            raise ValueError('Not Allowed!!!')
    else:
        qs = qs.filter(user=current_user)
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
        user_id = request.user.id
        if 'user_id' in data:
            user_id = long(data['user_id'])
            if request.user.id != user_id and not request.user.is_superuser:
                raise ValueError('Current  user can not create record for user "{}"'.format(user_id))
        item = Expense(
            amount = Decimal(data['amount']),
            description = data['description'],
            comment = data['comment'],
            transaction_dt = parser.parse(data['transaction_dt']),
            user_id=user_id
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