define(['jquery', 'backbone', 'views/expenses'], function ($, BB, ExpensesView) {
    var MainView = BB.View.extend({
        el: $('#app_main'),
        template: _.template('<div id="main_content"></div>'),
        initialize: function() {
            this.expenses_view = new ExpensesView();
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