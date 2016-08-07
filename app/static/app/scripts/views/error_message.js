define(['underscore', 'jquery', 'bootstrap', 'backbone', 'text!templates/error_message.html'], function (_, $, bs, BB, template_str) {
    return BB.View.extend({
        events: {
            'click .close_btn': 'on_close_click'
        },
        template: _.template(template_str),
        data: {title: 'Error!', message: ''},
        show: function ( data ) {
            this.data = _.extend(this.data, data);
            return this.render()
        },
        render: function () {
            this.$el.html(this.template(this.data))
            this.$('.modal').modal('show');
            return this.$el;
        },
        on_close_click: function () {
            this.$('.modal').modal('hide');
            this.remove();
        }
    })
});