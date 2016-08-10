define(['underscore', 'backbone', 'text!templates/expenses_filter.html'],
    function (_, BB, template_str) {
    return BB.View.extend({
        template: _.template(template_str),
        events: {
            'submit form': 'on_apply_filter',
        },
        on_apply_filter: function ( env ) {
            env.preventDefault()
            var data = {
                q: this.$('#free_text_input').val(),
            }
            console.log('data=', data);
            this.trigger('apply_filter', data);
        },
        render: function () {
            this.$el.html(this.template());
        }
    });

});