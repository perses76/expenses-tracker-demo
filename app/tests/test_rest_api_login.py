import json
import datetime
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse
from django.test import TestCase
# from app.models import User
from django.contrib.auth import get_user_model
User = get_user_model()


class RestApiLoginTestCase(TestCase):

    def setUp(self):
        User.objects.all().delete()

    def test_login_success(self):
        user = User(first_name='John', last_name='Smith', email='john@smith.com')
        user.set_password('12345')
        user.save()
        url = reverse('login')
        data = {'email': 'john@smith.com', 'password': '12345'}
        response = self.client.post(url, data=data)
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

    def test_login_user_does_not_exist(self):
        url = reverse('login')
        data = {'email': 'john@smith.com', 'password': '12345'}
        response = self.client.post(url, data=data)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['status'], 400)
        self.assertIsNotNone(response_data.get('message'))

    def test_wrong_password(self):
        user = User(first_name='John', last_name='Smith', email='john@smith.com')
        user.set_password('12345')
        user.save()

        url = reverse('login')
        data = {'email': 'john@smith.com', 'password': 'wrong password'}
        response = self.client.post(url, data=data)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['status'], 400)
        self.assertIsNotNone(response_data.get('message'))