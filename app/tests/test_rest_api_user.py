import json
from django.core.urlresolvers import reverse
from django.test import TestCase
from app.serializers import user_to_dict
from django.contrib.auth import get_user_model


User = get_user_model()


class RestApiUserTestCase(TestCase):

    def setUp(self):
        User.objects.all().delete()
        self.admin = User(
            first_name='Admin', last_name='Adim', email='admin@test.com',
            is_active=True, is_superuser=True, is_staff=True, username='admin'
        )
        self.admin.set_password('12345')
        self.admin.save()

        data = {'email': 'admin@test.com', 'password': '12345'}
        url = reverse('login')
        self.client.post(url, data=data)

    def test_get_all(self):
        item = User(username='test_user', first_name='First', last_name='Last', email='first@last.com', is_active=True)
        item.save()

        url = reverse('rest_api_user_list')
        response = self.client.get(url)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, [user_to_dict(self.admin), user_to_dict(item)])

    def test_create(self):
        data = {
            'email': 'new@test.com',
            'first_name': 'First1',
            'last_name': 'Last1',
            'role': 'regular',
            'password': '12345',
        }
        url = reverse('rest_api_user_item', kwargs={'id': ''})
        response = self.client.post(
            url,
            content_type='text/json',
            data=json.dumps(data),
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )

        # check if record is saved in DB
        item = User.objects.get(email='new@test.com')
        self.assertEqual(item.email, 'new@test.com')
        self.assertEqual(item.username, 'new@test.com')
        self.assertEqual(item.first_name, 'First1')
        self.assertEqual(item.last_name, 'Last1')
        self.assertEqual(item.is_superuser, False)
        self.assertEqual(item.is_staff, False)
        self.assertEqual(item.is_active, True)
        self.assertTrue(item.check_password('12345'))

        # check that response contain data of new created record
        expected_data = data.copy()
        expected_data['id'] = item.id
        del expected_data['password']
        result_data = json.loads(response.content)

        self.assertEqual(result_data, expected_data)

    def test_edit(self):
        item = User(first_name='First', last_name='Last', email='first@last.com', is_active=True)
        item.set_password('12345')
        item.save()
        data = {
            'id': item.id,
            'email': 'first1@last1.com',
            'first_name': 'First1',
            'last_name': 'Last1',
            'role': 'manager',
        }
        url = reverse('rest_api_user_item', kwargs={'id': item.id})
        response = self.client.put(
            url,
            content_type='text/json',
            data=json.dumps(data),
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )

        # check if record is saved in DB
        item = User.objects.get(id=item.id)
        self.assertEqual(item.email, 'first1@last1.com')
        self.assertEqual(item.username, 'first1@last1.com')
        self.assertEqual(item.first_name, 'First1')
        self.assertEqual(item.last_name, 'Last1')
        self.assertEqual(item.is_superuser, False)
        self.assertEqual(item.is_staff, True)
        self.assertEqual(item.is_active, True)
        self.assertTrue(item.check_password('12345'))

        # check that response contain data of new created record
        expected_data = data.copy()
        expected_data[u'id'] = item.id
        result_data = json.loads(response.content)

        self.assertEqual(result_data, expected_data)

    def test_edit_with_password(self):
        item = User(first_name='First', last_name='Last', email='first@last.com', is_active=True)
        item.set_password('12345')
        item.save()
        data = {
            'id': item.id,
            'email': 'first1@last1.com',
            'first_name': 'First1',
            'last_name': 'Last1',
            'role': 'manager',
            'password': '54321',
        }
        url = reverse('rest_api_user_item', kwargs={'id': item.id})
        self.client.put(
            url,
            content_type='text/json',
            data=json.dumps(data),
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )

        # check if record is saved in DB
        item = User.objects.get(id=item.id)
        self.assertTrue(item.check_password('54321'))

    def test_delete(self):
        item = User(first_name='First', last_name='Last', email='first@last.com', is_active=True)
        item.save()
        data = {
            'id': item.id,
            'email': 'first@last.com',
            'first_name': 'First',
            'last_name': 'Last',
            'role': 'regular',
        }
        url = reverse('rest_api_user_item', kwargs={'id': item.id})
        response = self.client.delete(url, content_type='text/json', HTTP_X_REQUESTED_WITH='XMLHttpRequest')

        # check if record is saved in DB
        try:
            User.objects.get(id=item.id)
            self.fail('User with id {} should not exist'.format(item.id))
        except User.DoesNotExist:
            pass
        # check that response contain data of new created record
        expected_data = data.copy()
        result_data = json.loads(response.content)
        self.assertEqual(result_data, expected_data)
