define(['backbone', 'models/user'], function (BB, User) {
    var app = new BB.Model({
        user: new User(),
    });
    return app;
})