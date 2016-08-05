"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".
"""

import django
from django.test import TestCase

# TODO: Configure your database in settings.py and sync before running tests.

class ViewTest(TestCase):
    """Tests for the application views."""

    def test_index(self):
        """Tests the home page."""
        response = self.client.get('/')
        # self.assertContains(response, 'Home Page', 1, 200)