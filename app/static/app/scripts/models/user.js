define(['backbone'], function (BB) {
    return BB.Model.extend({
        is_authenticated: function () {
            return  (this.id != null)
        }

    });
})