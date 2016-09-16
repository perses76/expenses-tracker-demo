from django.conf.urls import url, include

import views
import rest_api


rest_api_url_patterns = [
    # Expense
    url(r'^expenses/?$', rest_api.ExpenseResource.as_view(), name='expense_list'),
    url(r'^expenses/(?P<id>[0-9]*)/?$', rest_api.ExpenseResource.as_view(), name='expense_item'),

    # User
    url(r'^users/?$', rest_api.UserResource.as_view(), name='rest_api_user_list'),
    url(r'^users/(?P<id>[0-9]*)/?$', rest_api.UserResource.as_view(), name='rest_api_user_item'),

    # Authentication
    url(r'^login/?$', rest_api.login, name='login'),
    url(r'^auth/?$', rest_api.auth, name='auth'),
    url(r'^logout/?$', rest_api.logout, name='logout'),

    # print_expenses
    url(r'^print_expenses/?$', rest_api.print_expenses, name='print_expenses'),
    
]


urlpatterns = [
    url(r'^api/', include(rest_api_url_patterns)),
    url(r'$', views.index),
]
