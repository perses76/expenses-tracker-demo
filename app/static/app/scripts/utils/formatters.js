define([], function () {
    return {
        datetime_to_str: function (dt) {
            var day = dt.getDate();
            var month = dt.getMonth() + 1;
            if (day < 10) day = '0' + day;
            if (month < 10) month = '0' + month;
            return day + '/' + month + '/' + dt.getFullYear();
        }
    }
});