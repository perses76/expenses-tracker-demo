from django.http import HttpResponseBadRequest, HttpResponseServerError, HttpResponseForbidden
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


class InputDataError(Exception):
    pass


def user_authentication_required(func):
    def request_handler(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return  HttpResponseForbidden('You are not authenticated for this request')
        return func(self, request, *args, **kwargs)
    return request_handler


class Resource(View):

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        try:
            return super(Resource, self).dispatch(request, *args, **kwargs)
        except InputDataError as e:
            return HttpResponseBadRequest(str(e))
        except IOError as e:
            if not settings.DEBUG:
                raise
            return HttpResponseServerError(str(e))