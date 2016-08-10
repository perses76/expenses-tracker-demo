define([
        'underscore',
        'backbone',
        'text!templates/dashboard.html',
        'views/expenses',
        'views/users',
        'models/app'
    ],
    function (_, BB, template_str, ExpensesView, UsersView, app) {
    return BB.View.extend({
        template: _.template(template_str),
        state: 'expenses',
        events: {
            'click #logout_btn': 'on_login_click',
            'click #expenses_btn': 'on_expenses_click',
            'click #users_btn': 'on_users_click',
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
            this.$el.html(this.template({ user: app.get('user').toJSON() }));
            if (this.state == 'expenses') {
                content_view = new ExpensesView();
            } else {
                content_view = new UsersView();
            }
            this.$('#dashboard_content').append(content_view.$el);
            content_view.render();
            return this.$el;
        }
    })
});