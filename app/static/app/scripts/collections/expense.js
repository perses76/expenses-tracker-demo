define(['underscore', 'backbone', 'models/expense'], function (_, BB, Expense) {
    return BB.Collection.extend({
        url: '/api/expenses',
        model: Expense,
        parse: function (response, options) {
            _.each(response, function (item) {
                item.create_dt = new Date(item.create_dt);
            });
            return response;
        }
    });
});
