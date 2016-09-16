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
        expenses_filter_view: null,
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
            // this.filter_data.on('change', this.on_filter_data_changed, this);
            this.listenTo(this.filter_data, 'change', this.on_filter_data_changed);
        },
        on_model_remove: function () {
            this.expense_item_edit.reset();
        },
        on_filter_data_changed: function (data) {
            this.load_data();
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
                var tmp_col = new ExpenseCollection([model]);

                // this.expense_list_view.add_item(model);
            }
            model.save([], {
                success: function (model) {
                    app.window.alert('The record was successfully saved!');
                    view.expense_list_view.add_item(model);
                    view.expense_item_edit.reset();
                },
                error: function (model, response, options) {
                    app.window.alert('Operation error. Please look console for more info');
                    console.log('model, response, options =', arguments);
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
                    app.window.alert('Operation error. Please look console for more info');
                    console.log('model, response, options =', arguments);
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

            this.expenses_filter_view = new ExpensesFilterView({ model: this.filter_data });
            this.$('#expenses_filter').append(this.expenses_filter_view.$el);
            this.expenses_filter_view.render();
        },
        remove: function () {
            this.stopListening();
            this.expenses_filter_view.remove();
            BB.View.prototype.remove.call(this);
        },
    });
});