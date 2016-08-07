import json
import datetime
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse
from django.test import TestCase
from app.models import Expense


class UTC(datetime.tzinfo):
    _offset = datetime.timedelta(0)
    _dst = datetime.timedelta(0)
    _name = "UTC"
    def utcoffset(self, dt):
        return self._offset
    def dst(self, dt):
        return self._dst
    def tzname(self, dt):
        return self._name


class RestApiExpeneseTestCase(TestCase):

    def setUp(self):
        Expense.objects.all().delete()

    def test_get_all(self):
        create_dt = datetime.datetime(2016, 8, 6, 15, 48, 33, tzinfo=UTC())
        amount = Decimal('20.00')
        item = Expense(amount=amount, description='des1', comment='com1', create_dt=create_dt)
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
            'create_dt': '2016-08-06T15:48:33Z'
        }
        url = reverse('expense_item', kwargs={'id': ''})
        response = self.client.post(url, content_type='text/json', data=json.dumps(data), HTTP_X_REQUESTED_WITH='XMLHttpRequest')


        # check if record is saved in DB
        create_dt = datetime.datetime(2016, 8, 6, 15, 48, 33, tzinfo=UTC())
        amount = Decimal('20.00')
        item = Expense.objects.all()[0]
        self.assertEqual(item.amount, amount)
        self.assertEqual(item.description, 'des1')
        self.assertEqual(item.comment, 'com1')
        self.assertEqual(item.create_dt, create_dt)

        # check that response contain data of new created record
        expected_data = data.copy()
        expected_data[u'id'] = item.id
        result_data = json.loads(response.content)

        self.assertEqual(result_data, expected_data)

    def test_edit(self):
        create_dt = datetime.datetime(2016, 8, 6, 15, 48, 33, tzinfo=UTC())
        amount = Decimal('20.00')
        item = Expense(amount=amount, description='des1', comment='com1', create_dt=create_dt)
        item.save()
        item = Expense.objects.get(id=item.id)

        data = {
            'id': item.id,
            'comment': 'com2',
            'amount': '30.00',
            'description': 'des2',
            'create_dt': '2016-08-07T15:48:33Z'
        }
        url = reverse('expense_item', kwargs={'id': item.id})
        response = self.client.put(url, content_type='text/json', data=json.dumps(data), HTTP_X_REQUESTED_WITH='XMLHttpRequest')


        # check if record is saved in DB
        create_dt = datetime.datetime(2016, 8, 7, 15, 48, 33, tzinfo=UTC())
        amount = Decimal('30.00')
        item = Expense.objects.all()[0]
        self.assertEqual(item.amount, amount)
        self.assertEqual(item.description, 'des2')
        self.assertEqual(item.comment, 'com2')
        self.assertEqual(item.create_dt, create_dt)

        # check that response contain data of new created record
        expected_data = data.copy()
        result_data = json.loads(response.content)

        self.assertEqual(result_data, expected_data)