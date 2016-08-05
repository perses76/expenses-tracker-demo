define(['jquery', 'backbone', 'scripts/collections/expense'], function ($, BB, ExpenseCollection) {
    var MainView = BB.View.extend({
        el: $('#app_main'),
        initialize: function() {
            var col = new ExpenseCollection();
            col.fetch({
                success: function (items) {
                    console.log(items);
                    alert('Success!');
                },
                error: function () {
                    alert('Error!');
                }
            })
            alert('end!');

        },
        render: function () {
            this.$el.html('Hello world');
        }
    });
    var view = new MainView();
    view.render();
});