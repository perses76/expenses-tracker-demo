﻿define(['backbone', 'templates/expense_item'], function (BB, template) {
     return BB.View.extend({
        template: template,
        tagName: 'tr',
        className: 'expense_item',
        events: {
            'click': 'on_item_click',
        },
        initialize: function() {
            this.model.on('change', this.render, this)
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },
        on_item_click: function (ev) {
            this.trigger('select_item', this.model);
        },
        on_current_item_change: function (data) {
            var current_item = data.get('current_item');
            if (current_item.id == this.model.id) {
                this.$el.addClass('active');
            } else {
                this.$el.removeClass('active');
            }
        },
    });
});