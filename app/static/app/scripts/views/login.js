define(['underscore', 'backbone', 'text!templates/login.html'], function (_, BB, template_str) {
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
            alert('you want to login');

        }
    });
})