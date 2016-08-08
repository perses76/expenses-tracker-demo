define([
    'underscore',
    'jquery',
    'backbone',
    'views/expenses',
    'views/error_message',
    'models/app',
    'views/login'
    ],
    function (_, $, BB, ExpensesView, ErrorMessageView, app, LoginView) {
    var MainView = BB.View.extend({
        el: $('#app_main'),
        template: _.template('<div id="main_content"></div>'),
        initialize: function() {
            BB.ajax = _.bind(this.ajax, this);
            // this.expenses_view = new ExpensesView();
            // this.login_view = new LoginView();
            app.on('change:user', this.show_expenses_view, this);
        },
        on_user_was_changed: function () {
            this.show_expenses_view();
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
        show_expenses_view: function  () {
            this.render();
        },
        render: function () {
            if (app.get('user').is_authenticated()) {
                this.current_view = new ExpensesView();
            } else {
                this.current_view = new LoginView();
            }
            this.$el.html(this.template());
            this.current_view.setElement(this.$('#main_content'));
            this.current_view.render();
        }
    });
    var view = new MainView();
    view.render();
});