define(['underscore', 'jquery', 'backbone', 'views/expense_list', 'collections/expense', 'text!templates/expenses.html', 'views/expense_item_edit'],
    function (_, $, BB, ExpenseListView, ExpenseCollection, template_str, ExpenseItemEdit) {
     return BB.View.extend({
        template: _.template(template_str),
        initialize: function () {
            // this.load_data();
            this.expense_list_view = new ExpenseListView({ collection: new ExpenseCollection() });
            this.expense_list_view.on('select_item', this.on_select_item, this);
            this.expense_item_edit = new ExpenseItemEdit();
            this.expense_item_edit.on('save_item', this.on_save_item, this);
        },
        on_select_item: function (model) {
            this.show_edit_model(model);
        },
        show_edit_model: function (model) {
            this.expense_item_edit.set_model(model);
        },
        on_save_item: function (model) {
            var view = this;
            if (model.isNew()) {
                console.log('Before add to  collection!!');
                this.expense_list_view.add_item(model);
            }
            console.log('Before save');
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
            this.load_data();
        }
    });
});