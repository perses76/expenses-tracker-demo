define(['backbone'], function (BB) {
    return BB.Model.extend({
        defaults: {
            amount: 15,
            description: 'New description',
            comment: 'New comment',
            transaction_dt: new Date()
        },
        initialize: function (attrs) {
        },
    });
});