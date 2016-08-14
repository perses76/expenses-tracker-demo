define([
    'underscore',
    'jquery',
    'backbone',
    'views/dashboard',
    'views/error_message',
    'models/app',
    'views/login',
    'services/auth',
    'text!templates/main.html',
    ],
    function (_, $, BB, Dashboard, ErrorMessageView, app, LoginView, Auth, template_str) {
    var MainView = BB.View.extend({
        el: $('#app_main'),
        template: _.template(template_str),
        data: new BB.Model({status: 'zero'}),
        initialize: function() {
            // BB.ajax = _.bind(this.ajax, this);
            // this.expenses_view = new ExpensesView();
            // this.login_view = new LoginView();
            app.on('change:user', this.render, this);
        },
        render: function () {
            var view = this;
            if (this.data.get('status') == 'data_is_initialized') {
                if (this.current_view != null) {
                    this.current_view.remove();
                }
                if (app.get('user').is_authenticated()) {
                    this.current_view = new Dashboard();
                    this.current_view.on('logout', this.logout, this);
                } else {
                    this.current_view = new LoginView();
                }
                this.$el.html(this.template());
                this.current_view.setElement(this.$('#main_content'));
                this.current_view.render();
            } else {
                this.init_data();
            }
        },
        init_data: function () {
            var auth = new Auth(),
                view=this;
            auth.authenticate({
                success: function (user) {
                    view.data.set({ status: 'data_is_initialized' });
                    app.set({ user: user });
                }
            });
        }
    });
    var view = new MainView();
    view.render();
});