define(['backbone'], function (BB) {
    return BB.Model.extend({
        defaults: {
            id: null,
            email: 'test@test.com',
            first_name: 'first_test',
            last_name: 'last_test',
            password: null,
            role: 'regular'
        },
        is_authenticated: function () {
            return  (this.id != null)
        }

    });
})