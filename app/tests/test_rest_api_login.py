import json
import datetime
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse
from django.test import TestCase
from app.models import Expense
from app.utils import UTC


class RestApiLoginTestCase(TestCase):

    def setUp(self):
        pass
        # Expense.objects.all().delete()

    def test_login_success(self):
        url = reverse('login')
        data = {'email': 'john@smith.com', 'password': '12345'}
        response = self.client.post(url, data=data)
        response_data = json.loads(response.content)
        expected_data = {
            'status': 200,
            'user': {
                'firsti_name': 'John',
                'last_name': 'Smith',
                'email': 'johh@smith.com'
            }
        }
        self.assertEqual(response_data, expected_data)

    def test_login_fail(self):
        pass
