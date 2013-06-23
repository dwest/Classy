"use strict";

requirejs.config({
    baseUrl: "src",

    paths: {
        lib: "../lib",
        spec: "../spec"
    }
});

requirejs( ["lib/jasmine", "lib/domReady", "spec/TypeSpec"],
function( jasmine, domReady, spec ) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    domReady(function() {
        execJasmine();
    });

    function execJasmine() {
        jasmineEnv.execute();
    }

});
