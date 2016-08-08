import json
from django.http import HttpResponse


def login(request):
    data = {
        'status': 200,
        'user': {
            'id': 1,
            'firsti_name': 'John',
            'last_name': 'Smith',
            'email': 'johh@smith.com'
        }
    }
    data_json = json.dumps(data)
    return HttpResponse(data_json, content_type='application/json', status=200)