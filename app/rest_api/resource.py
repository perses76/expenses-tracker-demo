from django.http import HttpResponseBadRequest, HttpResponseServerError
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


class InputDataError(Exception):
    pass


class Resource(View):

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        try:
            return super(Resource, self).dispatch(request, *args, **kwargs)
        except InputDataError as e:
            return HttpResponseBadRequest(str(e))
        except Exception as e:
            if not settings.DEBUG:
                raise
            return HttpResponseServerError(str(e))