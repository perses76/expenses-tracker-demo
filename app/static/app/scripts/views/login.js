define(['models/app', 'underscore', 'backbone', 'text!templates/login.html', 'services/auth'],
    function (app, _, BB, template_str, Auth) {
    return BB.View.extend({
        template: _.template(template_str),
        events: {
            'submit form': 'on_form_submit',
        },
        render: function () {
            this.$el.html(this.template());
        },
        on_form_submit: function (env) {
            env.preventDefault();
            var view = this;
            var auth = new Auth();
            var email = this.$('#email_input').val();
            var password = this.$('#password_input').val();
            view.$('#auth_failed_widget').addClass('hidden');
            auth.login(email, password, {
                success: function (user) {
                    alert('Login view: successfully loged in');
                    app.set({ user: user });
                    console.log(user);
                },
                fail: function (status, message) {
                    view.$('#auth_failed_widget').removeClass('hidden');
                }
            })
        }
    });
})