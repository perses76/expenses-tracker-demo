define(['backbone'], function (BB) {
    return BB.View.extend({
        render: function () {
            this.$el.html('This is users view');
        }
    })
});