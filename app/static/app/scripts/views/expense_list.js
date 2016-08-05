define(['jquery', 'backbone', 'collections/expense', 'views/expense_item'], function ($, BB, ExpenseCollection, ExpenseItemView) {
     return BB.View.extend({
        initialize: function() {
            this.collection.on('add', this.on_item_added, this);
        },
        on_item_added: function (item) {
            console.log(item);
            alert('Item was added');
            var expense_item_view = new ExpenseItemView({ model: item });
            this.$el.append(expense_item_view.$el);
            expense_item_view.render();
        },
        render: function () {
            this.$el.html('Expense List');
        }
    });
});