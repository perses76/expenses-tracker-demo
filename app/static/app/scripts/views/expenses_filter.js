define([
    'models/app',
    'underscore',
    'backbone',
    'text!templates/expenses_filter.html',
    'collections/user',
    ],
    function (app, _, BB, template_str, UserCollection) {
    return BB.View.extend({
        template: _.template(template_str),
        users: null,
        events: {
            'submit form': 'on_apply_filter',
        },
        on_apply_filter: function ( env ) {
            env.preventDefault()
            this.model.set(this.get_filter_data());
            // this.trigger('apply_filter', this.get_filter_data());
        },
        get_filter_data: function () {
            return {
                q: this.$('#free_text_input').val(),
                user: this.$('.role_input').val()
            }
        },
        render: function () {
            var user = app.get('user');
            var data = {
                is_admin: (user.get('role') == 'admin')
            }
            this.$el.html(this.template(data));
            var role_input = this.$('.role_input');
            role_input.append('<option value="' + user.id + '">' + user.get('first_name') + ' ' + user.get('last_name') + '</option>');
            role_input.val(user.id);
            if (user.get('role') == 'admin') {
                var user_collection = new UserCollection();
                user_collection.fetch({
                    success: function (collection) {
                        role_input.empty();
                        collection.each(function (item) {
                            role_input.append('<option value="' + item.id + '">' + item.get('first_name') + ' ' + item.get('last_name') + '</option>');
                        });
                        role_input.val(user.id);
                    },
                    error: function () {
                        alert('error!');
                    }
                });
            }
        }
    });

});