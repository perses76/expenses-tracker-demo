define(['underscore'], function (_) {
    var validate_rule = function (rule, view) {
        var ctrl = view.$(rule.ctrl),
            msg_ctrl = view.$(rule.msg_ctrl),
            validator = get_validator(rule);
        msg_ctrl.addClass('hidden');
        if (!validator(ctrl.val())) {
            msg_ctrl.removeClass('hidden');
            return false
        }
        return true;
    }

    var validators = {
        is_required: function (txt) { return /[^\s]+/.test(txt);},
        is_decimal: function (txt) { return /\d+(\.\d{1,2})?/.test(txt);},
        is_email: function (txt) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(txt);
        },
        is_datetime: function (txt) {
            var re = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/;
            if (!re.test(txt)) {
                return false;
            }
            var ar, ar_date, ar_time, yy, mm, dd, hh, mn;
            ar = txt.split(' ');
            ar_date = ar[0].split('/');
            ar_time = ar[1].split(':');
            yy = parseInt(ar_date[2]);
            mm = parseInt(ar_date[1]);
            dd = parseInt(ar_date[0]);
            hh = parseInt(ar_time[0])
            mn = parseInt(ar_time[2])
            if (yy < 1900 || yy > 2100) return false;
            if (mm < 1 || mm > 12) return false;
            if (dd < 1 || dd > 31) return false;
            if (hh < 0 || hh > 23) return false;
            if (mn < 0 || mn > 59) return false;
            return true;
        }
    }

    var get_validator = function (rule) {
        if (rule.reg_exp != undefined) {
            return function (txt) {
                return rule.reg_exp.test(txt);
            }
        }
        return validators[rule.check];
    }

    return {
        validate: function (rules, view) {
            var result = true;
            _.each(rules, function (rule) {
                var r = validate_rule(rule, view);
                if (!r) result = false;
            });
            return result;
        }
    }
});