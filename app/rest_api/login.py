import json
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login as auth_login


def login(request):
    email = request.POST['email']
    password = request.POST['password']
    user = authenticate(email=email, password=password)
    if user is None:
        auth_failed_data = {'status': 400, 'message': 'Password or email is not correct'}
        return HttpResponse(json.dumps(auth_failed_data), status=200, content_type='application/json')
    auth_login(request, user)

    data = {
        'status': 200,
        'user': {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        }
    }
    data_json = json.dumps(data)
    return HttpResponse(data_json, content_type='application/json', status=200)