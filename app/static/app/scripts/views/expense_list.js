define(['jquery', 'backbone', 'views/expense_item', 'text!templates/expense_list.html'], function ($, BB, ExpenseItemView, template_str) {
     return BB.View.extend({
        tagName: 'table',
        className: 'table',
        template: template_str,
        initialize: function() {
            this.collection.on('add', this.on_item_added, this);
        },
        on_item_added: function (item) {
            console.log(item);
            var expense_item_view = new ExpenseItemView({ model: item });
            this.$tbody.append(expense_item_view.$el);
            expense_item_view.render();
        },
        render: function () {
            this.$el.append(this.template);
            this.$tbody = this.$('tbody');
            console.log('tbody', this.$tbody);
            this.$el.append(this.$tbody);
        }
    });
});