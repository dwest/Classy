"use strict";

describe("Types", /* in a */function() {

    it( "should create a constructor function" , function() {
        expect(typeof Classy.Type()).toEqual("function");
    });

    it( "should create new instances with ``new''" , function() {
        var MyClass = Classy.Type( {} );

        expect(typeof new MyClass()).toEqual("object");
    });

    it( "should allow type checking with ``instanceof''" , function() {
        var MyClass = Classy.Type( {} );

        expect(new MyClass instanceof MyClass).toBe(true);
    });

    it( "should call the user defined constructor when an instance is created" , function() {
        var typedef = {
            constructor: function() {
            },
        };

        spyOn(typedef, "constructor");

        var MyType   = Classy.Type(typedef);
        var instance = new MyType;

        expect(typedef.constructor).toHaveBeenCalled();
    });

    describe( "User Constructors", /* in a */function() {
        var MyType     = null,
            instance   = null,
            typedef    = {
                a: undefined,
                b: undefined,

                constructor: function(a, b) {
                    this.a = a;
                    this.b = b;
                },
            };

        beforeEach(function() {
            spyOn(typedef, 'constructor').andCallThrough();
            MyType = Classy.Type(typedef);
            instance = new MyType(1, 2);
        });

        it( "should have access to all arguments of the original constructor" , function() {
            expect(typedef.constructor).toHaveBeenCalledWith(1, 2);
        });

        it( "should be able to mutate the instance" , function() {
            expect(instance.a).toBe(1);
            expect(instance.b).toBe(2);
        });
    });

    describe( "Static Members", /* in a */function() {
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
            MyType = Classy.Type(typedef);
            a      = new MyType();
            b      = new MyType();
        });

        it( "should be shared across instances", function() {
            a.mutateStatic(42);
            b.mutateStatic(14);

            expect(b.readStatic()).toEqual(a.readStatic());
            expect(a.readStatic()).toEqual(14);
        });
    });

    describe( "Static Methods", /* in a */function() {
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
            MyType = Classy.Type(typedef);
        });

        it( "should be immutable" , function() {

            var reassign = function() {
                MyType.Static.staticMethod = function() {
                    return "something else";
                };
            };

            expect(reassign).toThrow();
        });
    });

    describe( "Inheritance", /* in a */function(){/*...*/

        var superType,
            subType,
            instance;

        var superClass = {

            member:"variable",

            constructor:function() {
                this.member = 'initial';
            },
        },

        subClass={

            constructor: function() {
                this.member = 'different';
            },
        };

        beforeEach( function(){
            superType = Classy.Type(superClass);
            subType   = Classy.Derive(superType, subClass);
            instance  = new subType;
        });

        it( "should allow base types to derive from one parent type" , function() {
            console.log(instance);
            expect(instance instanceof subType).toEqual(true);
            expect(instance instanceof superType).toEqual(true);
        });
    });
});
