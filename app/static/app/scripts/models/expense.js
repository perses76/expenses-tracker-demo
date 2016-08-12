define(['backbone'], function (BB) {
    return BB.Model.extend({
        defaults: {
            amount: 0,
            description: '',
            comment: '',
            transaction_dt: new Date()
        },
        initialize: function (attrs) {
        },
        parse: function (response, options) {
            var item = response;
            item.transaction_dt = new Date(item.transaction_dt);
            return item;
        },
    });
});