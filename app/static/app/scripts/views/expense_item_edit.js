define(['underscore', 'backbone', 'text!templates/expense_item_edit.html', 'models/expense'],
    function (_, BB, template_str, ExpenseModel) {
    return BB.View.extend({
        events: {
            'submit form': 'on_form_submit'
        },
        template: _.template(template_str),
        initialize: function (options) {
            if (this.model == null) this.model = new ExpenseModel();
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },
        on_form_submit: function (ev) {
            ev.preventDefault();
            // this.clearErrors();
            // this.readData();
            // if (!this.validateData()) return
            this.update_model();
            this.trigger('save_item', this.model);
        },
        update_model: function () {
            var data = {
                amount: parseFloat(this.$('#amount_input').val()),
                description: this.$('#description_input').val(),
                comment: this.$('#comment_input').val(),
                create_dt: new Date(this.$('#create_dt_input').val()),
            }
            this.model.set(data);
        },
    });
})