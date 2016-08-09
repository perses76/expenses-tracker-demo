import json
import datetime
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse
from django.test import TestCase
from app.serializers import user_to_dict
from app.utils import UTC
from django.contrib.auth import get_user_model


User = get_user_model()


class RestApiUserTestCase(TestCase):

    def setUp(self):
        User.objects.all().delete()

    def test_get_all(self):
        item = User(first_name='First', last_name='Last', email='first@last.com', is_active=True)
        item.save()

        url = reverse('rest_api_user_list')
        response = self.client.get(url)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, [user_to_dict(item)])