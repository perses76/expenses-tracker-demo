define([
    'underscore',
    'jquery',
    'backbone',
    'text!templates/print_expenses.html'],
    function (_, $, BB, template_str) {
    return BB.View.extend({
        template: _.template(template_str),
        render: function () {
            this.$('#print_expenses').remove();
            var view = this,
                url = '/api/print_expenses';
            url += '?' + $.param(this.model.toJSON());
            var $iframe = $('<iframe src="' + url + '" name="print_expenses" id="print_expenses"></iframe>');
            $iframe.hide();
            this.$el.append($iframe);
            window.frames['print_expenses'].print();
            return this.$el;
        },
    });
});