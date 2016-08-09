define([
    'underscore',
    'jquery',
    'backbone',
    'views/user_list',
    'collections/user',
    'text!templates/users.html',
    ],
    function (_, $, BB, UserListView, UserCollection, template_str) {
     return BB.View.extend({
        template: _.template(template_str),
        initialize: function () {
            // this.load_data();
            this.user_list_view = new UserListView({ collection: new UserCollection() });
            this.user_list_view.on('select_item', this.on_select_item, this);
            // this.expense_item_edit = new ExpenseItemEdit();
            // this.expense_item_edit.on('save_item', this.on_save_item, this);
        },
        on_select_item: function (model) {
            this.show_edit_model(model);
        },
        show_edit_model: function (model) {
            alert('To be implemented');
            //this.expense_item_edit.set_model(model);
        },
        on_save_item: function (model) {
            var view = this;
            if (model.isNew()) {
                this.user_list_view.add_item(model);
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
            var col = new UserCollection();
            var view = this;
            col.fetch({
                success: function (items) {
                    view.expenses_items = items;
                    items.each(function (item) {
                        view.user_list_view.collection.add(item);
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
            this.$('#user_list').append(this.user_list_view.$el);
            this.user_list_view.render();

            // this.$('#expense_item_edit').append(this.expense_item_edit.$el);
            // this.expense_item_edit.render();
            this.load_data();
        }
    });
});
