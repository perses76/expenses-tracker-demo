from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt


class Resource(View):

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super(Resource, self).dispatch(request, *args, **kwargs)