import json
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.views.decorators.csrf import csrf_exempt
from app.serializers import user_to_dict


@csrf_exempt
def login(request):
    email = request.POST['email']
    password = request.POST['password']
    user = authenticate(email=email, password=password)
    if user is None:
        auth_failed_data = {'status': 400, 'message': 'Password or email is not correct'}
        return HttpResponse(json.dumps(auth_failed_data), status=200, content_type='application/json')
    django_login(request, user)

    data = {
        'status': 200,
        'user': user_to_dict(user),
    }
    data_json = json.dumps(data)
    return HttpResponse(data_json, content_type='application/json', status=200)


@csrf_exempt
def auth(request):
    user = request.user
    if user.is_authenticated():
        data = {
            'status': 200,
            'user': user_to_dict(user),
        }
    else:
        data = {
            'status': 200,
            'user': {
                'id': None,
                'first_name': None,
                'last_name': None,
                'email': None,
                'role': 'anonymous'
            }
        }
    data_json = json.dumps(data)
    return HttpResponse(data_json, content_type='application/json', status=200)


@csrf_exempt
def logout(request):
    django_logout(request)
    return HttpResponse('{"status": 200}', content_type='application/json', status=200)
