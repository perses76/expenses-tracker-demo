define(['underscore', 'backbone', 'text!templates/dashboard.html', 'views/expenses'],
    function (_, BB, template_str, ExpensesView) {
    return BB.View.extend({
        template: _.template(template_str),
        events: {
            'click #logout_btn': 'on_login_click',
        },
        on_login_click: function () {
            this.trigger('logout');
        },
        render: function () {
            this.$el.html(this.template());
            var expenses_view = new ExpensesView();
            this.$('#dashboard_content').append(expenses_view.$el);
            expenses_view.render();
            return this.$el;
        }
    })
});