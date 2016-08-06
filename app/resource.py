from django.http import HttpResponseBadRequest
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt


class Resource(View):

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return HttpResponseBadRequest('This is 400 error')
        return super(Resource, self).dispatch(request, *args, **kwargs)