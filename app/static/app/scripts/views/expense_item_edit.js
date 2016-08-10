define(['underscore', 'backbone', 'text!templates/expense_item_edit.html', 'models/expense', 'utils/formatters'],
    function (_, BB, template_str, ExpenseModel, formatters) {
    return BB.View.extend({
        events: {
            'submit form': 'on_form_submit',
            'click .add_new_btn': 'on_add_new_click',
            'click .cancel_btn': 'on_cancel_click',
        },
        on_cancel_click: function (env) {
            this.render();
        },
        on_add_new_click: function (env) {
            this.reset();
        },
        template: _.template(template_str),
        initialize: function (options) {
            if (this.model == null) this.model = new ExpenseModel();
        },
        reset: function () {
            this.set_model(new ExpenseModel);
        },
        render: function () {
            data = this.model.toJSON();
            data['transaction_dt'] = formatters.datetime_to_str(data['transaction_dt']);
            data['is_new'] = this.model.isNew();
            this.$el.html(this.template(data));
        },
        set_model: function (model) {
            this.model = model;
            this.render();
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
                transaction_dt: formatters.parse_datetime(this.$('#transaction_dt_input').val()),
            }
            this.model.set(data);
        },
    });
})