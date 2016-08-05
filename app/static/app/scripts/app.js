require.config({
    baseUrl: myapp.baseUrl,
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        'jquery': 'libs/jquery.min',
        'backbone': 'libs/backbone.min',
        'underscore': 'libs/underscore.min',
        'views': 'scripts/views',
        'collections': 'scripts/collections',
        'models': 'scripts/models',
        'templates': 'scripts/templates',
        'text': 'libs/text'
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

require(['views/main']);

