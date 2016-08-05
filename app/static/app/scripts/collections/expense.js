define(['backbone', 'scripts/models/expense'], function (BB, Expense) {
    return BB.Collection.extend({
        url: '/api/expenses',
        model: Expense
    });
});
