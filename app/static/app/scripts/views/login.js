define(['models/app', 'underscore', 'backbone', 'text!templates/login.html', 'services/auth', 'views/signup'],
    function (app, _, BB, template_str, Auth, SigupView) {
    return BB.View.extend({
        template: _.template(template_str),
        events: {
            'submit form': 'on_form_submit',
            'click .signup_btn': 'on_signup_click',
        },
        render: function () {
            this.$el.html(this.template());
        },
        on_signup_click: function (env) {
            var view = new SigupView();
            view.on('save_item', this.on_do_save_item, this);
            this.$el.append(view.$el);
            view.render();
        },
        on_do_save_item: function(model, edit_view) {
            model.save([], {
                success: function (model) {
                    alert('Success saved!');
                    edit_view.remove();
                },
                error: function (model, response, options) {
                    edit_view.show_error(response.responseText);
                }
            });
        },
        on_form_submit: function (env) {
            env.preventDefault();
            if (!this.validate_input()) return;

            var view = this;
            var auth = new Auth();
            var email = this.$('.email_input').val();
            var password = this.$('.password_input').val();

            view.$('.auth_failed_widget').addClass('hidden');
            auth.login(email, password, {
                success: function (user) {
                    alert('Login view: successfully loged in');
                    app.set({ user: user });
                    console.log(user);
                },
                fail: function (status, message) {
                    view.$('.auth_failed_widget').removeClass('hidden');
                }
            })
        },
        validate_input: function () {
            var ctrl, re, result;
            result = true;

            ctrl = this.$('.email_input');
            this.$('.email_input_error').addClass('hidden');
            re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(ctrl.val())) {
                this.$('.email_input_error').removeClass('hidden');
                result = false;
            }

            ctrl = this.$('.password_input');
            this.$('.password_input_error').addClass('hidden');
            re = /[^\s]+/;
            if (!re.test(ctrl.val())) {
                this.$('.password_input_error').removeClass('hidden');
                result = false;
            }
            return result
        }
    });
})