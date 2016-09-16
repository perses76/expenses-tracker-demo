import json
import datetime
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse
from django.test import TestCase
from app.models import Expense
from app.utils import UTC
from django.contrib.auth import get_user_model


User = get_user_model()


class RestApiExpeneseTestCase(TestCase):

    def setUp(self):
        Expense.objects.all().delete()
        User.objects.all().delete()
        self.user = User(
            first_name='First', last_name='last', email='first@last.com',
            is_active=True, is_superuser=False, is_staff=False, username='regular'
        )
        self.user.set_password('12345')
        self.user.save()

        data = {'email': 'first@last.com', 'password': '12345'}
        url = reverse('login')
        self.client.post(url, data=data)

    def test_get_all(self):
        transaction_dt = datetime.datetime(2016, 8, 6, 15, 48, 33, tzinfo=UTC())
        amount = Decimal('20.00')
        item = Expense(
            amount=amount, description='des1', comment='com1', transaction_dt=transaction_dt,
            user=self.user
        )
        item.save()
        item = Expense.objects.get(id=item.id)

        url = reverse('expense_list')
        response = self.client.get(url)
        expected_data = json.dumps([item.to_dict()], cls=DjangoJSONEncoder)
        self.assertEqual(response.content, expected_data)

    def test_create(self):
        data = {
            'comment': 'com1',
            'amount': '20.00',
            'description': 'des1',
            'transaction_dt': '2016-08-06T15:48:33Z'
        }
        url = reverse('expense_item', kwargs={'id': ''})
        response = self.client.post(
            url,
            content_type='text/json',
            data=json.dumps(data),
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )

        # check if record is saved in DB
        transaction_dt = datetime.datetime(2016, 8, 6, 15, 48, 33, tzinfo=UTC())
        amount = Decimal('20.00')
        item = Expense.objects.all()[0]
        self.assertEqual(item.amount, amount)
        self.assertEqual(item.description, 'des1')
        self.assertEqual(item.comment, 'com1')
        self.assertEqual(item.transaction_dt, transaction_dt)

        # check that response contain data of new created record
        expected_data = data.copy()
        expected_data['id'] = item.id
        result_data = json.loads(response.content)

        self.assertEqual(result_data, expected_data)

    def test_edit(self):
        transaction_dt = datetime.datetime(2016, 8, 6, 15, 48, 33, tzinfo=UTC())
        amount = Decimal('20.00')
        item = Expense(
            amount=amount, description='des1', comment='com1', transaction_dt=transaction_dt,
            user=self.user
        )
        item.save()
        item = Expense.objects.get(id=item.id)

        data = {
            'id': item.id,
            'comment': 'com2',
            'amount': '30.00',
            'description': 'des2',
            'transaction_dt': '2016-08-07T15:48:33Z'
        }
        url = reverse('expense_item', kwargs={'id': item.id})
        response = self.client.put(
            url,
            content_type='text/json',
            data=json.dumps(data),
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )

        # check if record is saved in DB
        transaction_dt = datetime.datetime(2016, 8, 7, 15, 48, 33, tzinfo=UTC())
        amount = Decimal('30.00')
        item = Expense.objects.all()[0]
        self.assertEqual(item.amount, amount)
        self.assertEqual(item.description, 'des2')
        self.assertEqual(item.comment, 'com2')
        self.assertEqual(item.transaction_dt, transaction_dt)

        # TODO check that response contain data of new created record
        # expected_data = data.copy()
        # result_data = json.loads(response.content)

    def test_delete(self):
        from django.core.exceptions import ObjectDoesNotExist
        transaction_dt = datetime.datetime(2016, 8, 6, 15, 48, 33, tzinfo=UTC())
        amount = Decimal('20.00')
        item = Expense(
            amount=amount, description='des1', comment='com1', transaction_dt=transaction_dt,
            user=self.user
        )
        item.save()
        item = Expense.objects.get(id=item.id)

        url = reverse('expense_item', kwargs={'id': item.id})
        response = self.client.delete(url, content_type='text/json', HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)
        data = json.dumps(item.to_dict(), cls=DjangoJSONEncoder)
        self.assertEqual(response.content, data)

        try:
            Expense.objects.get(id=item.id)
            self.fail('Item must not exists')
        except ObjectDoesNotExist:
            pass
