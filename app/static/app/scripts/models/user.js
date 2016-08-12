define(['backbone'], function (BB) {
    return BB.Model.extend({
        defaults: {
            id: null,
            email: '',
            first_name: '',
            last_name: '',
            password: null,
            role: 'regular'
        },
        is_authenticated: function () {
            return  (this.id != null)
        },
        get_full_name: function () {
            return this.first_name + ' ' + this.last_name;
        }
    });
})