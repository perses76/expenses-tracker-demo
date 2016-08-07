define(['backbone', 'views/expense_item', 'text!templates/expense_list.html'], function (BB, ExpenseItemView, template_str) {
     return BB.View.extend({
        tagName: 'table',
        className: 'table',
        template: template_str,
        data: new BB.Model(),
        initialize: function() {
            this.collection.on('add', this.on_item_added, this);
        },
        on_item_added: function (item) {
            console.log(item);
            var expense_item_view = new ExpenseItemView({ model: item });
            expense_item_view.on('select_item', this.on_select_item, this);
            this.data.on('change:current_item', expense_item_view.on_current_item_change, expense_item_view);
            this.$tbody.append(expense_item_view.$el);
            expense_item_view.render();
        },
        add_item: function (item) {
            this.collection.add(item);
        },
        on_select_item: function (model) {
            this.trigger('select_item', model);
            this.data.set({ current_item: model });
        },
        render: function () {
            this.$el.append(this.template);
            this.$tbody = this.$('tbody');
            console.log('tbody', this.$tbody);
            this.$el.append(this.$tbody);
        }
    });
});