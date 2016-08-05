"""
Definition of urls for expenses_tracker.
"""

from django.conf.urls import url, include

import app.urls

urlpatterns = [
    url(r'^', include(app.urls)),
]
