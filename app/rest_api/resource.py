from django import http
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


class InputDataError(Exception):
    pass


class UserNotAuthorized(Exception):
    pass


def user_authentication_required(func):
    def request_handler(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return  http.HttpResponseForbidden('You are not authenticated for this request')
        return func(self, request, *args, **kwargs)
    return request_handler


class Resource(View):

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        try:
            return super(Resource, self).dispatch(request, *args, **kwargs)
        except UserNotAuthorized as e:
            return http.HttpResponseForbidden(str(e))
        except InputDataError as e:
            return http.HttpResponseBadRequest(str(e))
        except IOError as e:
            if not settings.DEBUG:
                raise
            return http.HttpResponseServerError(str(e))