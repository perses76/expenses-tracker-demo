define(['underscore', 'backbone', 'models/user'], function (_, BB, User) {
    return BB.Collection.extend({
        url: '/api/users',
        model: User,
    });
});
