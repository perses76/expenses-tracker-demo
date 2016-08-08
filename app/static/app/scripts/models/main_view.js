define(['backbone', 'models/user'], function (BB, User) {
    return BB.Model.extend({
        defaults: {
            user: new User()
        }

    });
})