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
            console.log('this=', this);
            this.trigger('save_item', this.model, this);
        },
        update_model: function () {
            var data = {
                email: this.$('#email_input').val(),
                first_name: this.$('#first_name_input').val(),
                last_name: this.$('#last_name_input').val(),
                role: this.$('#role_input').val(),
            }
            this.model.set(data);
        },
        remove: function () {
            var view = this;
            this.$('.modal').on('hide.bs.modal', function () {
                Backbone.View.prototype.remove.apply(view, arguments);
            });
            this.$('.modal').modal('hide');
        }
    });
})