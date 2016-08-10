define([
    'underscore',
    'backbone',
    'text!templates/user_item_edit.html',
    'collections/user',
    'utils/formatters',
    'bootstrap',
    'utils/input_validator',
    'models/app',
    ],
    function (_, BB, template_str, UserCollection, formatters, boostrap, validator, app) {
    return BB.View.extend({
        events: {
            'submit form': 'on_form_submit'
        },
        template: _.template(template_str),
        initialize: function (options) {
            if (this.model == null) this.model = (new UserCollection()).create_new();
        },
        render: function () {
            var data = this.model.toJSON(),
                view=this;
            if (this.model.isNew()) {
                data.title = 'New user';
            } else {
                data.title = 'Edit user: ' + this.model.id;
            }
            data.user = app.get('user').toJSON();
            this.$el.html(this.template(data));
            this.$('#role_input').val(data.role);
            this.$('.modal').modal('show');
            this.$('.modal').on('hide.bs.modal', function () {
                Backbone.View.prototype.remove.apply(view, arguments);
            });
        },
        set_model: function (model) {
            this.model = model;
            this.render();
        },
        on_form_submit: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            if (!this.validate_data()) return;
            this.update_model();
            this.trigger('save_item', this.model, this);
        },
        validate_data: function () {
            this.hide_error();
            rules = [
                { ctrl: '#email_input', msg_ctrl: '#email_input_error', check: 'is_email' },
                { ctrl: '#first_name_input', msg_ctrl: '#first_name_input_error', check: 'is_required' },
                { ctrl: '#last_name_input', msg_ctrl: '#last_name_input_error', check: 'is_required' },
            ]

            if (this.model.isNew()) {
                rules.push(
                    { ctrl: '#password_input', msg_ctrl: '#password_input_error', check: 'is_required' }
                );
            }
            var result = validator.validate(rules, this);
            
            var password = this.$('#password_input').val();
            this.$('#password_confirm_input_error').addClass('hidden');
            if (password != '') {
                var password_confirm = this.$('#password_confirm_input').val();
                if (password != password_confirm) {
                    result = false;
                    this.$('#password_confirm_input_error').removeClass('hidden');
                }
            }
            return result;
        },
        show_error: function (message) {
            this.$('#form_error').removeClass('hidden');
            this.$('#form_error_message').html(message);
        },
        hide_error: function () {
            this.$('#form_error').addClass('hidden');
        },
        update_model: function () {
            var data = {
                email: this.$('#email_input').val(),
                first_name: this.$('#first_name_input').val(),
                last_name: this.$('#last_name_input').val(),
                role: 'regular',
            }
            if (this.$('#role_input').length > 0) {
                data.role = this.$('#role_input').val();
            }
            var password = '';
            password = this.$('#password_input').val();
            if (password != '') {
                data['password'] = password;
            }
            this.model.set(data);
        },
        remove: function () {
            this.$('.modal').modal('hide');
        }
    });
})