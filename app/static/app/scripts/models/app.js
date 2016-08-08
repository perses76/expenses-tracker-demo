define(['backbone', 'models/user'], function (BB, User) {
    var App = BB.Model.extend({
        logout: function () {
            alert('Reset user');
            this.set({ user: new User });
        }
    })
    var app = new App({
        user: new User(),
    });

    return app;
})