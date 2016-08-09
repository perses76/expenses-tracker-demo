def user_to_dict(user):
    return {
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': get_user_role(user),
    }


def get_user_role(user):
    if user.is_superuser:
        return 'admin'

    if user.is_staff:
        return 'manager'

    return 'regular'