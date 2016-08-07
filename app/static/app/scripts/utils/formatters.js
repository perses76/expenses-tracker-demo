define([], function () {
    return {
        datetime_to_str: function (dt) {
            if (dt == null) {
                return '';
            }
            var day = dt.getDate();
            var month = dt.getMonth() + 1;
            if (day < 10) day = '0' + day;
            if (month < 10) month = '0' + month;
            var hh = dt.getHours();
            if (hh < 10) hh = '0' + hh;
            var mm = dt.getMinutes();
            if (mm < 10) mm = '0' + mm;
            return day + '/' + month + '/' + dt.getFullYear() + ' ' + hh + ':' + mm;
        },
        parse_datetime: function (str) {
            if (str == '') {
                return null;
            }
            var ar, ar_date, ar_time, date_str, time_str;
            ar = str.split(' ');
            date_str = ar[0];
            time_str = ar[1];
            ar_date = date_str.split('/');
            ar_time = time_str.split(':');
            return new Date(
                parseInt(ar_date[2]),
                parseInt(ar_date[1]) - 1,
                parseInt(ar_date[0]),
                parseInt(ar_time[0]),
                parseInt(ar_time[1])
            )
        },
    }
});