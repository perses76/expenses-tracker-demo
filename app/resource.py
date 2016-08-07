from django.http import HttpResponseBadRequest, HttpResponseServerError
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt


class Resource(View):

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        try:
            return super(Resource, self).dispatch(request, *args, **kwargs)
        except Exception as e:
            return HttpResponseBadRequest(str(e))
