import json
import datetime
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.contrib.auth import get_user_model
User = get_user_model()


class RestApiAuthTestCase(TestCase):

    def setUp(self):
        User.objects.all().delete()

    def test_user_exists(self):
        user = User(first_name='John', last_name='Smith', email='john@smith.com')
        user.set_password('12345')
        user.save()

        self.client.post(reverse('login'), data={'email': 'john@smith.com', 'password': '12345'})
        response = self.client.post(reverse('auth'))

        response_data = json.loads(response.content)
        expected_data = {
            u'status': 200,
            u'user': {
                u'id': user.id,
                u'first_name': u'John',
                u'last_name': u'Smith',
                u'email': u'john@smith.com'
            }
        }
        self.assertEqual(response_data, expected_data)

    def test_user_is_not_logged_in(self):
        user = User(first_name='John', last_name='Smith', email='john@smith.com')
        user.set_password('12345')
        user.save()

        response = self.client.post(reverse('auth'))

        response_data = json.loads(response.content)
        expected_data = {
            u'status': 200,
            u'user': {
                u'id': None,
                u'first_name': None,
                u'last_name': None,
                u'email': None
            }
        }
        self.assertEqual(response_data, expected_data)