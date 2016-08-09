from decimal import Decimal
import json
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from resource import Resource, InputDataError
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
        self.validate(data)
        item = User()
        self._update_item(item, data)
        item.set_password(data['password'])
        item.save()
        item = User.objects.get(id=item.id)
        item_json = json.dumps(user_to_dict(item), cls=DjangoJSONEncoder)
        return HttpResponse(item_json, status=200, content_type='application/json')

    def put(self, request, id):
        data = json.loads(request.body)
        self.validate(data)
        item = User.objects.get(id=id)
        self._update_item(item, data)
        if data.get('password'):
            item.set_password(data['password'])
        item.save()
        item = User.objects.get(id=item.id)
        item_json = json.dumps(user_to_dict(item), cls=DjangoJSONEncoder)
        return HttpResponse(item_json, status=200, content_type='application/json')

    def validate(self, data):
        try: 
            item = User.objects.get(email=data['email'])
            if item.id != data.get('id'):
                raise InputDataError('User with email="{}" already exists'.format(data['email']))
        except User.DoesNotExist:
            pass
        return True

    def _update_item(self, item, data):
        item.email = data['email']
        item.username = data['email']
        item.first_name = data['first_name']
        item.last_name = data['last_name']
        role = data['role']
        if role == 'admin':
            item.is_superuser = True
            item.is_staff = True
        if role == 'manager':
            item.is_superuser = False
            item.is_staff = True

    def delete(self, request, id):
        item = User.objects.get(pk=id)
        item_json = json.dumps(user_to_dict(item), cls=DjangoJSONEncoder)
        item.delete()
        return HttpResponse(item_json, status=200, content_type='application/json')