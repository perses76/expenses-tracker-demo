require.config({
    baseUrl: myapp.baseUrl,
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        'jquery': 'libs/jquery.min',
        'backbone': 'libs/backbone.min',
        'underscore': 'libs/underscore.min'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
    }
});

require(['scripts/main']);

