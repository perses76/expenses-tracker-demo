define(['underscore'], function (_) {
    var validate_rule = function (rule, view) {
        var ctrl = view.$(rule.ctrl),
            msg_ctrl = view.$(rule.msg_ctrl),
            re = get_reg_exp(rule);
        msg_ctrl.addClass('hidden');
        if (!re.test(ctrl.val())) {
            msg_ctrl.removeClass('hidden');
            return false
        }
        return true;
    }

    var get_reg_exp = function (rule) {
        if (rule.reg_exp != undefined) {
            return  rule.reg_exp
        }
        if (rule.check == 'is_required') {
            return /[^\s]+/;
        }
        if (rule.check == 'is_email') {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        }
        alert('Can not fine validator for  rule. Look console for more info');
        console.log(rule);
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