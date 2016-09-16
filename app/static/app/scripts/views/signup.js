define(['backbone', 'views/user_item_edit'],
    function (BB, UserItemEditView) {
        return BB.View.extend({
            render: function () {
                var edit_view = new UserItemEditView();
                edit_view.on('save_item', function (model, edit_view) {
                    this.trigger('save_item', model, edit_view);
                }, this);
                this.$el.append(edit_view.$el);
                edit_view.render();
                return this.$el;
            }
        })
});