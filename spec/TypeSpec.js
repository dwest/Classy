"use strict";

describe("Type", function() {

    it("should create a constructor function", function() {
        expect(typeof Type()).toEqual("function");
    });

    it("should create new instances with ``new''", function() {
        var MyClass = Type({});
        
        expect(typeof new MyClass()).toEqual("object");
        expect(new MyClass() instanceof MyClass).toBe(true);
    });

    it("should call the user defined constructor when an instance is created", function() {
        var typedef = {
            constructor: function() {
            },
        };

        spyOn(typedef, "constructor");

        var MyType = Type(typedef);
        var instance = new MyType;

        expect(typedef.constructor).toHaveBeenCalled();
    });

    describe("User Constructors", function() {
        var MyType     = null,
            instance = null,
            typedef = {
                a: undefined,
                b: undefined,
                
                constructor: function(a, b) {
                    this.a = a;
                    this.b = b;
                },
            };
        
        beforeEach(function() {
            spyOn(typedef, 'constructor').andCallThrough();
            MyType = Type(typedef);
            instance = new MyType(1, 2);
        });
    
        it("should have access to all arguments of the original constructor", function() {
            expect(typedef.constructor).toHaveBeenCalledWith(1, 2);
        });

        it("should be able to mutate the instance", function() {
            expect(instance.a).toBe(1);
            expect(instance.b).toBe(2);
        });
    });

    describe("Static members", function() {
        var MyType  = null,
            a       = null,
            b       = null,
            typedef = {
                Static: {
                    c: undefined,
                },
                
                mutateStatic: function(v) {
                    MyType.Static.c = v;
                },

                readStatic: function() {
                    return MyType.Static.c;
                },
            }
        ;

        beforeEach(function() {
            MyType = Type(typedef);
            a      = new MyType();
            b      = new MyType();
        });

        it("should be shared across instances", function() {
            a.mutateStatic(42);
            b.mutateStatic(14);

            expect(b.readStatic()).toEqual(a.readStatic());
            expect(a.readStatic()).toEqual(14);
        });
    });

    describe("Static Methods", function() {
        var MyType = null,
            typedef = {
                Static: {
                    staticMethod: function() {
                        return "something";
                    },
                },
            }
        ;
        
        beforeEach(function() {
            MyType = Type(typedef);
        });

        it("should not allow direct modification", function() {

            var reassign = function() {
                MyType.Static.staticMethod = function() {
                    return "something else";
                };
            };

            expect(reassign).toThrow();
        });
    });
});
