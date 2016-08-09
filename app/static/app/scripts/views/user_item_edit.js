define([
    'underscore',
    'backbone',
    'text!templates/user_item_edit.html',
    'models/user',
    'utils/formatters',
    'bootstrap'
    ],
    function (_, BB, template_str, UserModel, formatters, boostrap) {
    return BB.View.extend({
        events: {
            'submit form': 'on_form_submit'
        },
        template: _.template(template_str),
        initialize: function (options) {
            if (this.model == null) this.model = new UserModel();
        },
        render: function () {
            var data = this.model.toJSON();
            console.log('Edit user:', data);
            this.$el.html(this.template(data));
            this.$('.modal').modal('show');
        },
        set_model: function (model) {
            this.model = model;
            this.render();
        },
        on_form_submit: function (ev) {
            ev.preventDefault();
            this.update_model();
            this.trigger('save_item', this.model);
        },
        update_model: function () {
            var data = {
                amount: parseFloat(this.$('#amount_input').val()),
                description: this.$('#description_input').val(),
                comment: this.$('#comment_input').val(),
                transaction_dt: formatters.parse_datetime(this.$('#transaction_dt_input').val()),
            }
            this.model.set(data);
        },
    });
})