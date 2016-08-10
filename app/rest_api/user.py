from decimal import Decimal
import json
from django import http
from django.core.serializers.json import DjangoJSONEncoder
import resource
from dateutil import parser
from django.contrib.auth import get_user_model
from ..serializers import user_to_dict
from app.utils import get_user_role


User = get_user_model()


class UserResource(resource.Resource):
    @resource.user_authentication_required
    def get(self, request, id=None):
        role = get_user_role(request.user)
        # return http.HttpResponseForbidden('Role={}, user_id={}, is_superuser={}'.format(role, request.user.id, request.user.is_superuser))

        if role == 'regular':
            return http.HttpResponseForbidden('Regular user does not have access to user REST API')

        if role == 'admin':
            qs = User.objects.all()
        else:
            qs = User.objects.filter(is_superuser=False, is_staff=False)

        items = [user_to_dict(item) for item in qs]
        items_json = json.dumps(items, cls=DjangoJSONEncoder)
        return http.HttpResponse(items_json, content_type='application/json', status=200)

    def post(self, request):
        role = get_user_role(request.user)
        if role == 'regular' and request.user.is_authenticated():
            return http.HttpResponseForbidden('Regular user does not have permission to create new user')

        if not request.user.is_authenticated() and role != 'regular':
            return http.HttpResponseForbidden('Anonymous user can create only regular new user')

        data = json.loads(request.body)
        self.validate(data)

        if role == 'manager' and data['role'] != 'regular':
            return http.HttpResponseForbidden('Manager can manage only regular user')

        item = User()
        self._update_item(item, data)
        item.set_password(data['password'])
        item.save()
        item = User.objects.get(id=item.id)
        item_json = json.dumps(user_to_dict(item), cls=DjangoJSONEncoder)
        return http.HttpResponse(item_json, status=200, content_type='application/json')

    @resource.user_authentication_required
    def put(self, request, id):
        role = get_user_role(request.user)
        if role == 'regular':
            return http.HttpResponseForbidden('Regular user does not have access to user REST API')

        data = json.loads(request.body)
        self.validate(data)

        if role == 'manager' and data['role'] != 'regular':
            return http.HttpResponseForbidden('Manager can manage only regular user')

        item = User.objects.get(id=id)

        if role == 'manager' and get_user_role(item) != 'regular':
            return http.HttpResponseForbidden('Manager can manage only regular user')

        self._update_item(item, data)
        if data.get('password'):
            item.set_password(data['password'])
        item.save()
        item = User.objects.get(id=item.id)
        item_json = json.dumps(user_to_dict(item), cls=DjangoJSONEncoder)
        return http.HttpResponse(item_json, status=200, content_type='application/json')

    def validate(self, data):
        try: 
            item = User.objects.get(email=data['email'])
            if item.id != data.get('id'):
                raise resource.InputDataError('User with email="{}" already exists'.format(data['email']))
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
        if role == 'regular':
            item.is_superuser = False
            item.is_staff = False

    def delete(self, request, id):
        role = get_user_role(request.user)
        if role == 'regular':
            return http.HttpResponseForbidden('Regular user does not have access to user REST API')

        item = User.objects.get(pk=id)
        if role == 'manager' and get_user_role(item) != 'regular':
            return http.HttpResponseForbidden('Manager can manage only regular user')

        item_json = json.dumps(user_to_dict(item), cls=DjangoJSONEncoder)
        item.delete()
        return http.HttpResponse(item_json, status=200, content_type='application/json')