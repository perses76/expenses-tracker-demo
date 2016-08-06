define(['underscore', 'jquery', 'backbone', 'views/expense_list', 'collections/expense', 'text!templates/expenses.html', 'views/expense_item_edit'],
    function (_, $, BB, ExpenseListView, ExpenseCollection, template_str, ExpenseItemEdit) {
     return BB.View.extend({
        template: _.template(template_str),
        initialize: function () {
            this.load_data();
            this.expense_list_view = new ExpenseListView({ collection: new ExpenseCollection() });
            this.expense_item_edit = new ExpenseItemEdit();
            this.expense_item_edit.on('save_item', this.on_save_item, this);
        },
        on_save_item: function (model) {
            alert('You want to save model' + model);
            var view = this;
            this.expense_list_view.add_item(model);
            model.save([], {
                success: function (model) {
                    alert('Success saved!');
                },
                error: function () {
                    alert('error');
                }
            });
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
                },
                error: function () {
                    alert('Error!');
                }
            })
        },
        render: function () {
            this.$el.html(this.template());
            this.$('#expense_list').append(this.expense_list_view.$el);
            this.expense_list_view.render();

            this.$('#expense_item_edit').append(this.expense_item_edit.$el);
            this.expense_item_edit.render();
        }
    });
});