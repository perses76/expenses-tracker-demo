define(['jquery', 'backbone', 'collections/user', 'models/user'],
    function ($, BB, UserCollection, User) {
    return BB.View.extend ({
        login: function (email, password, options) {
            var data = { email: email, password: password },
                view = this
                url='/api/login';
            options = _.extend({ success: function () { }, fail: function () { } }, options);
            BB.ajax(url, {
                data: data,
                method: 'POST',
                success: function (data) {
                    if (data.status == 200) {
                        var col = new UserCollection(),
                            user =  new User(data.user);
                        col.add(user);
                        options.success(user);
                        return;
                    }
                    if (data.status == 400) {
                        options.fail(data.status, data.message);
                        return;
                    }
                },
                error: function () {
                    app.window.alert('Operation error. Please look console for more info');
                    console.log('model, response, options =', arguments);
                }
            });
        },
        authenticate: function (options) {
            var url = '/api/auth';
            BB.ajax(url, {
                method: 'GET',
                success: function (data) {
                    var col = new UserCollection(),
                        user =  new User(data.user);
                    col.add(user);
                    options.success(user);
                    return;
                },
                error: function () {
                    app.window.alert('Operation error. Please look console for more info');
                    console.log('model, response, options =', arguments);
                }
            });

        },
        logout: function (options) {
            var url = '/api/logout';
            BB.ajax(url, {
                method: 'GET',
                success: function () {
                    options.success();
                    return;
                },
                error: function () {
                    app.window.alert('Operation error. Please look console for more info');
                    console.log('model, response, options =', arguments);
                }
            });

        },
        getCookie: function (name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    })
});