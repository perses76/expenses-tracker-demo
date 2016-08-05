define(['jquery', 'backbone', 'views/expense_list', 'collections/expense'], function ($, BB, ExpenseListView, ExpenseCollection) {
     return BB.View.extend({
        initialize: function () {
            this.load_data();
            this.expense_list_view = new ExpenseListView({ collection: new ExpenseCollection() });
        },
        load_data: function () {
            var col = new ExpenseCollection();
            var view = this;
            col.fetch({
                success: function (items) {
                    view.expenses_items = items;
                    items.each(function (item) {
                        view.expense_list_view.collection.add(item);
                    });
                    console.log(items);
                    alert('Success!');
                },
                error: function () {
                    alert('Error!');
                }
            })
            alert('end!');

        },
        render: function () {
            this.expense_list_view.setElement(this.$el);
            this.expense_list_view.render();
        }
    });
});