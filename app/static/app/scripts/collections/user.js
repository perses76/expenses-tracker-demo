define(['underscore', 'backbone', 'models/user'], function (_, BB, User) {
    return BB.Collection.extend({
        url: '/api/users',
        model: User,
        create_new: function () {
            var user = new User();
            user.url = this.url;
            return user;
        }
    });
});
