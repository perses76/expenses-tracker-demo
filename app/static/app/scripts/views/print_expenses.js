define([
    'underscore',
    'jquery',
    'backbone',
    'text!templates/print_expenses.html'],
    function (_, $, BB, template_str) {
    return BB.View.extend({
        template: _.template(template_str),
        render: function () {
            var view = this;
            var $iframe = $('<iframe src="/api/print_expenses" name="print_expenses"></iframe>');
            this.$el.append($iframe);
            // window.frames['print_expenses'].print();
            return;
        }
    });
});