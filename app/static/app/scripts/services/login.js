define(['jquery', 'backbone', 'models/user'],
    function ($, BB, User) {
    return BB.View.extend ({
        url: 'api/login',
        login: function (email, password, options) {
            alert('Start login process');
            var data = { email: email, password: password },
                view = this;
            options = _.extend({ success: function () { }, fail: function () { } }, options);
            BB.ajax(this.url, {
                data: data,
                method: 'POST',
                beforeSend: function (xhr) {
                  // Set the CSRF Token in the header for security
                    var token = view.getCookie('csrftoken');
                    if (token) xhr.setRequestHeader('X-CSRFToken', token);
                },
                success: function (data) {
                    console.log('data=', data)
                    if (data.status == 200) {
                        options.success(new User(data.user));
                        return;
                    }
                    if (data.status == 400) {
                        options.fail(data.status, data.message);
                        return;
                    }
                },
                error: function () {
                    alert('Login service Error');
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