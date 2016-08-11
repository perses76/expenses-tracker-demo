define([
        'underscore',
        'backbone',
        'text!templates/dashboard.html',
        'views/expenses',
        'views/users',
        'models/app',
        'views/user_item_edit'
    ],
    function (_, BB, template_str, ExpensesView, UsersView, app, UserItemEditView) {
    return BB.View.extend({
        template: _.template(template_str),
        state: 'expenses',
        current_view:  null,
        events: {
            'click #logout_btn': 'on_login_click',
            'click #expenses_btn': 'on_expenses_click',
            'click #users_btn': 'on_users_click',
            'click .current_user': 'on_current_user_click',
        },
        on_current_user_click: function (env) {
            env.preventDefault();
            var edit_user = new UserItemEditView({ model: app.get('user') });

            edit_user.on('save_item', function (model, edit_view) {
                model.save(null, {
                    success: function (model) {
                        app.window.alert('The record was successfully saved!')
                        edit_view.remove();
                    },
                    error: function (model, response, options) {
                        app.window.alert('Operation error. Please look console for more info');
                        console.log('model, response, options =', arguments);
                    }
                })
            });

            this.$el.append(edit_user.$el);
            edit_user.render();
        },
        on_login_click: function () {
            this.trigger('logout');
        },
        on_expenses_click: function () {
            this.state = 'expenses';
            this.render();
        },
        on_users_click: function () {
            this.state = 'users';
            this.render();
        },
        render: function () {
            var content_view;
            if (this.current_view != null) {
                this.current_view.remove();
            }
            this.$el.html(this.template({ user: app.get('user').toJSON() }));
            if (this.state == 'expenses') {
                this.current_view = new ExpensesView();
                this.$("#users_btn").removeClass('active');
                this.$("#expenses_btn").addClass('active');
            } else {
                this.current_view = new UsersView();
                this.$("#users_btn").addClass('active');
                this.$("#expenses_btn").removeClass('active');
            }
            this.$('#dashboard_content').append(this.current_view.$el);
            this.current_view.render();
            return this.$el;
        },
        remove: function () {
            BB.View.prototype.remove.call(this);
        },
    })
});