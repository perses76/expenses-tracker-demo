define(['models/app', 'underscore', 'backbone', 'text!templates/login.html', 'services/login'],
    function (app, _, BB, template_str, LoginService) {
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
            var ls = new LoginService();
            ls.login('john@smith.com', 'password', {
                success: function (user) {
                    alert('Login view: successfully loged in');
                    app.set({ user: user });
                    console.log(user);
                },
                error: function (status, message) {
                    alert('Error');
                }
            })
        }
    });
})