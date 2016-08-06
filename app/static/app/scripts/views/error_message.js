define(['underscore', 'jquery', 'bootstrap', 'backbone', 'text!templates/error_message.html'], function (_, $, bs, BB, template_str) {
    return BB.View.extend({
        events: {
            'click .close': 'on_close_click'
        },
        template: _.template(template_str),
        show: function () {
            return this.render()
        },
        render: function () {
            this.$el.html(template_str);
            this.$('.modal').modal('show');
            return this.$el;
        },
        on_close_click: function () {
            this.$('.modal').modal('hide');
            this.remove();
        }
    })
});