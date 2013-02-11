"use strict";

// Change the global object to match your environment
(function(global) {

    /**
     * Properties which have special meaning.
     */
    var RESERVED = ["Static", "constructor",];
    
    /**
     * Return the first non-null defined argument passed to this
     * function, or undefined if no arguments meet these criteria.
     * Accepts a variable number of arguments.
     *
     * @param {Mixed} any - variable list of arguments
     */
    function coalesce() {
        for(var i = 0; i < arguments.length; i++) {
            if(arguments[i] !== undefined && arguments[i] !== null)
                return arguments[i];
        }
        
        return undefined;
    }

    /**
     * Shorthand.
     */
    function isCallable(v) {
        return typeof v === "function";
    }

    /**
     * Convert a type definition to a properties list for use with
     * ``Object.defineProperties''.
     *
     * @param {Object} definition
     * @return {Object} properties list
     */
    function definitionToProperties(definition, reserved) {
        var props    = {};
        reserved = coalesce(reserved, RESERVED);
        
        Object.keys(definition)
        // Special properties will be set up later
        .filter(function(key) {
            if(reserved.indexOf(key) !== -1)
                return false;

            return true;
        })

        // Set up methods to invoke within the right context
        .map(function(key) {
            var prop = {
                enumerable: true,
                writable: true,
                value: definition[key]
            };
            
            // Callable properties will be invoked with the type as ``this''
            if(isCallable(definition[key])) {
                prop = {
                    writable: false,
                    value: definition[key],
                };
            }

            props[key] = prop;
        })
        ;

        return props;
    }

    global.Type = function(definition) {
        definition = coalesce(definition, {});

        var Static  = Object.defineProperties({}, definitionToProperties(coalesce(definition["Static"], {}), [])), // Shared static space for all objects of this type
            props   = definitionToProperties(definition);

        var constructor = function() {
            Object.defineProperties(this, props);

            if(isCallable(definition.constructor))
                definition.constructor.apply(this, arguments);
        };

        constructor.Static = Static;

        return constructor;
    };

    global.Extend = function(type, definition) {
        
    };
    
}(window));
