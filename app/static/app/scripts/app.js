﻿require.config({
    baseUrl: myapp.baseUrl,
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        'jquery': 'libs/jquery.min',
        'backbone': 'libs/backbone.min',
        'underscore': 'libs/underscore.min',
        'bootstrap': 'libs/bootstrap/js/bootstrap.min',
        'text': 'libs/text',
        'views': 'scripts/views',
        'collections': 'scripts/collections',
        'models': 'scripts/models',
        'templates': 'scripts/templates',
        'utils': 'scripts/utils',
        'services': 'scripts/services',
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: null
        },
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

