define(['backbone', 'models/expense'], function (BB, Expense) {
    return BB.Collection.extend({
        url: '/api/expenses',
        model: Expense
    });
});
