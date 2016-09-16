import datetime


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


def get_user_role(user):
    if user.is_superuser:
        return 'admin'

    if user.is_staff:
        return 'manager'

    return 'regular'
