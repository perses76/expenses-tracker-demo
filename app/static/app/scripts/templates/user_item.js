define(['underscore', 'utils/formatters'], function (_, formatters) {
    var template = _.template(
'<td><%= id %></td>' +
'<td><%= email %></td>' +
'<td><%= first_name %></td>' +
'<td><%= last_name %></td>' +
'<td><%= role %></td>' +
'<td>' +
'<button type="button" class="close delete_btn" aria-label="Delete"><span aria-hidden="true">&times;</span></button>' +
'</td>');

    var render = function (data) {
        data = _.extend(data, formatters);
        return template(data)
    }
    return render;
});
