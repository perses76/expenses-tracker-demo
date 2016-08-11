define([
    'underscore',
    'jquery',
    'backbone',
    'views/dashboard',
    'views/error_message',
    'models/app',
    'views/login',
    'services/auth'
    ],
    function (_, $, BB, Dashboard, ErrorMessageView, app, LoginView, Auth) {
    var MainView = BB.View.extend({
        el: $('#app_main'),
        template: _.template('<div id="main_content"></div>'),
        data: new BB.Model({status: 'zero'}),
        initialize: function() {
            // BB.ajax = _.bind(this.ajax, this);
            // this.expenses_view = new ExpensesView();
            // this.login_view = new LoginView();
            app.on('change:user', this.render, this);
        },
        ajax: function (settings) {
            var original_error = settings.error
            var view = this;
            settings.error = function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                var title = jqXHR.status + jqXHR.statusText,
                    message = jqXHR.responseText;
                view.show_error_message({ title: errorThrown, message: message});
                return original_error(arguments);
            }
            return BB.$.ajax.apply(Backbone.$, arguments);
        },
        show_error_message: function (options) {
            var error_message = new ErrorMessageView();
            this.$el.append(error_message.$el);
            error_message.show(options)
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
        logout: function () {
            var auth = new Auth(),
                view=this;
            auth.logout({
                success: function (user) {
                    view.data.set({ status: 'zero' });
                    app.logout();
                }
            });
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