define(['jquery', 'backbone'], function ($, BB) {
    var MainView = BB.View.extend({
        el: $('#app_main'),
        render: function () {
            this.$el.html('Hello world');
        }
    });
    var view = new MainView();
    view.render();
});