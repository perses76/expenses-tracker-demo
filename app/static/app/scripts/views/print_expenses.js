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
            $iframe.hide();
            this.$el.append($iframe);
            window.frames['print_expenses'].print();
            // this.remove();
            return;
        },
        render1: function () {
            w = window.open('/api/print_expenses', '_blank');
            w.onunload = function(){
                console.log('closed!');
            }
            w.focus();
            w.print();
            // w.close();
        }
    });
});