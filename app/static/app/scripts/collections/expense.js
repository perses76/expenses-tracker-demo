define(['underscore', 'backbone', 'models/expense'], function (_, BB, Expense) {
    return BB.Collection.extend({
        url: '/api/expenses',
        model: Expense,
        parse: function (response, options) {
            _.each(response, function (item) {
                item.transaction_dt = new Date(item.transaction_dt);
            });
            return response;
        }
    });
});
