define(['underscore', 'backbone', 'models/expense'], function (_, BB, Expense) {
    return BB.Collection.extend({
        url: '/api/expenses',
        model: Expense,
    });
});
