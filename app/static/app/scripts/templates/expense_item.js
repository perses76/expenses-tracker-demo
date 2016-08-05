define(['underscore', 'scripts/utils/formatters'], function (_, formatters) {
    var template =  _.template(
'<td><%= amount %></td>' +
'<td><%= description %></td>' +
'<td><%= datetime_to_str(create_dt) %></td>');

    var render = function (data) {
        data = _.extend(data, formatters);
        return template(data)
    }
    return render;
});
