define(['underscore', 'jquery', 'backbone', 'collections/expense', 'text!templates/expense_item.html'], function (_, $, BB, ExpenseCollection, template) {
     return BB.View.extend({
        template: _.template(template),
        tagName: 'div',
        className: 'expense_item',
        initialize: function() {
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });
});