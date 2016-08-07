define(['underscore', 'scripts/utils/formatters'], function (_, formatters) {
    var template = _.template(
'<td><%= amount %></td>' +
'<td><%= description %></td>' +
'<td><%= datetime_to_str(transaction_dt) %></td>' +
'<td>' +
'<button type="button" class="close delete_btn" aria-label="Delete"><span aria-hidden="true">&times;</span></button>' +
'</td>');

    var render = function (data) {
        data = _.extend(data, formatters);
        return template(data)
    }
    return render;
});
