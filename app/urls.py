from django.conf.urls import url, include

import views
import rest_api


rest_api_url_patterns = [
    # Expense
    url(r'^expenses/?$', rest_api.ExpenseResource.as_view(), name='expense_list'),
    url(r'^expenses/(?P<id>[0-9]?)/?$', rest_api.ExpenseResource.as_view(), name='expense_item'),
]


urlpatterns = [
    url(r'^api/', include(rest_api_url_patterns)),
    url(r'$', views.index),
]
