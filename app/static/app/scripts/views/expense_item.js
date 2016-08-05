define(['backbone', 'templates/expense_item'], function (BB, template) {
     return BB.View.extend({
        template: template,
        tagName: 'tr',
        className: 'expense_item',
        initialize: function() {
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });
});