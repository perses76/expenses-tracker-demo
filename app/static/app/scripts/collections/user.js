define(['underscore', 'backbone', 'models/user'], function (_, BB, User) {
    return BB.Collection.extend({
        url: '/api/users',
        model: User,
        create_new: function () {
            var user = new User();
            var col = new BB.Collection(null);
            col.url = this.url;
            col.add(user);
            return user;
        }
    });
});
