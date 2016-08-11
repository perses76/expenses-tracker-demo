define([
    'models/app',
    'underscore',
    'jquery',
    'backbone',
    'views/user_list',
    'collections/user',
    'text!templates/users.html',
    'views/user_item_edit',
    ],
    function (app, _, $, BB, UserListView, UserCollection, template_str, UserItemEditView) {
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
            var view = this,
                save_method;
            save_method = function (options) { model.save([], options) };
            if (model.isNew()) {
                save_method = function (options) {
                    options = _.extend(options, { wait: true });
                    view.user_list_view.collection.create(model, options)
                };
            }
            save_method({
                success: function (model) {
                    app.window.alert('The record was successfully saved!')
                    alert('00022 New user ' + model.get('email') + 'was created successfully. You can loging now!');
                    edit_view.remove();
                },
                error: function (model, response, options) {
                    app.window.alert('Operation error. Please look console for more info');
                    console.log('model, response, options =', arguments);
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
                },
                error: function () {
                    app.window.alert('Operation error. Please look console for more info');
                    console.log('model, response, options =', arguments);
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
