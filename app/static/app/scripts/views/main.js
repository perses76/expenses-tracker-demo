define(['underscore', 'jquery', 'backbone', 'views/expenses', 'views/error_message'], function (_, $, BB, ExpensesView, ErrorMessageView) {
    var MainView = BB.View.extend({
        el: $('#app_main'),
        template: _.template('<div id="main_content"></div>'),
        initialize: function() {
            BB.ajax = _.bind(this.ajax, this);
            this.expenses_view = new ExpensesView();
        },
        ajax: function (settings) {
            var original_error = settings.error
            var view = this;
            settings.error = function () {
                view.show_error_message('This is text  of  this error message')
                alert('WWWWWWWWWW');
                return original_error(arguments);
            }
            return BB.$.ajax.apply(Backbone.$, arguments);
        },
        show_error_message: function (msg) {
            var error_message = new ErrorMessageView();
            this.$el.append(error_message.$el);
            error_message.show()
        },
        render: function () {
            this.$el.html(this.template());
            this.expenses_view.setElement(this.$('#main_content'));
            this.expenses_view.render();
        }
    });
    var view = new MainView();
    view.render();
});