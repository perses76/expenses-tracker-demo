define([
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
    function (_, $, BB, ExpenseListView, ExpenseCollection, template_str, ExpenseItemEdit, ExpensesFilterView,
        PrintExpensesView) {
     return BB.View.extend({
        template: _.template(template_str),
        filter_data: new BB.Model({q: ''}),
        events: {
            'click .print_btn': 'on_print_click',

        },
        on_print_click: function (env) {
            var print_view = new PrintExpensesView({el: this.$('#print_area'), collection: this.items });
            print_view.render();
        },
        initialize: function () {
            this.expense_list_view = new ExpenseListView({ collection: new ExpenseCollection() });
            this.expense_list_view.on('select_item', this.on_select_item, this);
            this.expense_item_edit = new ExpenseItemEdit();
            this.expense_item_edit.on('save_item', this.on_save_item, this);
            this.filter_data.on('change', this.on_filter_data_changed, this);
        },
        on_filter_data_changed: function () {
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
                this.expense_list_view.add_item(model);
            }
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
            var data = {};
            if (this.filter_data.get('q') != '') {
                data.q = this.filter_data.get('q')
            }
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
                    console.log(items);
                },
                error: function () {
                    alert('Error!');
                }
            })
        },
        on_apply_filter: function (data) {
            this.filter_data.set(data);
        },
        render: function () {
            this.$el.html(this.template());
            this.$('#expense_list').append(this.expense_list_view.$el);
            this.expense_list_view.render();

            this.$('#expense_item_edit').append(this.expense_item_edit.$el);
            this.expense_item_edit.render();
            this.load_data();

            var expenses_filter_view = new ExpensesFilterView();
            this.$('#expenses_filter').append(expenses_filter_view.$el);
            expenses_filter_view.render();
            expenses_filter_view.on('apply_filter', this.on_apply_filter, this);
        }
    });
});