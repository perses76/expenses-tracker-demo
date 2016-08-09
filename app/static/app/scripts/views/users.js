define([
    'underscore',
    'jquery',
    'backbone',
    'views/user_list',
    'collections/user',
    'text!templates/users.html',
    'views/user_item_edit',
    ],
    function (_, $, BB, UserListView, UserCollection, template_str, UserItemEditView) {
     return BB.View.extend({
        template: _.template(template_str),
        events: {
            'click .add_new_btn': 'on_add_new_click',
        },
        initialize: function () {
            this.user_list_view = new UserListView({ collection: new UserCollection() });
            this.user_list_view.on('select_item', this.on_select_item, this);
        },
        on_add_new_click: function () {
            var view = new UserItemEditView();
            view.on('save_item', this.on_save_item, this);
            this.$el.append(view.$el);
            view.render();
        },
        on_select_item: function (model) {
            this.show_edit_model(model);
        },
        show_edit_model: function (model) {
            var view = new UserItemEditView({ model: model });
            view.on('save_item', this.on_save_item, this);
            this.$el.append(view.$el);
            view.render();
        },
        on_save_item: function (model, edit_view) {
            var view = this;
            model = model.clone();
            if (model.isNew()) {
                this.user_list_view.add_item(model);
            }
            model.save([], {
                success: function (model, view) {
                    alert('Success saved!');
                    edit_view.remove();
                },
                error: function (model, response, options) {
                    edit_view.show_error(response.responseText);
                    // view.user_list_view.remove(model);
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
            console.log('btn', this.$('.add_new_btn'));

            // this.$('#expense_item_edit').append(this.expense_item_edit.$el);
            // this.expense_item_edit.render();
            this.load_data();
        }
    });
});
