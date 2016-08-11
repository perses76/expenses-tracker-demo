define(['backbone', 'models/user'], function (BB, User) {
    var App = BB.Model.extend({
        logout: function () {
            this.set({ user: new User });
        },
        window: {
            alert: function (txt) {
                alert(txt);
            }
        }
    })
    var app = new App({
        user: new User(),
    });

    return app;
})