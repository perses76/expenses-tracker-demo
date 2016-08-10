define([
       'models/app',
       'underscore',
        'jquery',
        'backbone',
        'views/expense_list',
        'collections/expense',
        'text!templates/expenses.html',
        'views/expense_item_edit',
        'views/expenses_filter',
        'views/print_expenses'
    ],
    function (app, _, $, BB, ExpenseListView, ExpenseCollection, template_str, ExpenseItemEdit, ExpensesFilterView,
        PrintExpensesView) {
     return BB.View.extend({
        template: _.template(template_str),
        filter_data: new BB.Model({q: ''}),
        events: {
            'click .print_btn': 'on_print_click',

        },
        on_print_click: function (env) {
            var print_view = new PrintExpensesView({el: this.$('#print_area'), model: this.filter_data });
            print_view.render();
        },
        initialize: function () {
            this.expense_list_view = new ExpenseListView({ collection: new ExpenseCollection() });
            this.expense_list_view.collection.on('remove', this.on_model_remove, this);
            this.expense_list_view.on('select_item', this.on_select_item, this);
            this.expense_item_edit = new ExpenseItemEdit();
            this.expense_item_edit.on('save_item', this.on_save_item, this);
            this.filter_data.on('change', this.on_filter_data_changed, this);
        },
        on_model_remove: function () {
            this.expense_item_edit.reset();
        },
        on_filter_data_changed: function (data) {
            alert('Filter data was changed');
            this.load_data();
            console.log(this.filter_data.toJSON());
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
                if (app.get('user').get('role') == 'admin') {
                    if (this.filter_data.get('user') != '') {
                        model.set({user_id: this.filter_data.get('user')});
                    }
                }
                this.expense_list_view.add_item(model);
            }
            model.save([], {
                success: function (model) {
                    alert('Success saved!');
                    view.expense_item_edit.reset();
                },
                error: function () {
                    alert('error');
                }
            });
        },
        load_data: function () {
            var col = new ExpenseCollection();
            var view = this;
            var data = this.filter_data.toJSON();
            col.fetch({
                data: data,
                success: function (items) {
                    view.expenses_items = items;
                    view.expense_list_view.collection.remove(
                        view.expense_list_view.collection.models
                    );
                    items.each(function (item) {
                        view.expense_list_view.collection.add(item);
                    });
                    view.expense_item_edit.reset();

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

            var expenses_filter_view = new ExpensesFilterView({ model: this.filter_data });
            this.$('#expenses_filter').append(expenses_filter_view.$el);
            expenses_filter_view.render();
        }
    });
});