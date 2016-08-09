define(['backbone', 'views/user_item', 'text!templates/user_list.html'], function (BB, UserItemView, template_str) {
     return BB.View.extend({
        tagName: 'table',
        className: 'table',
        template: template_str,
        data: new BB.Model(),
        initialize: function() {
            this.collection.on('add', this.on_item_added, this);
        },
        on_item_added: function (item) {
            var user_item_view = new UserItemView({ model: item });
            user_item_view.on('select_item', this.on_select_item, this);
            this.data.on('change:current_item', user_item_view.on_current_item_change, user_item_view);
            this.$tbody.append(user_item_view.$el);
            user_item_view.render();
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
            this.$el.append(this.$tbody);
        }
    });
});