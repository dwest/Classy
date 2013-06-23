"use strict";

define(["classy"], function(classy) {
    describe("Types", /* in a */function() {

        it( "should create a constructor function" , function() {
            expect(typeof classy.type()).toEqual("function");
        });

        it( "should create new instances with ``new''" , function() {
            var MyClass = classy.type( {} );

            expect(typeof new MyClass()).toEqual("object");
        });

        it( "should allow type checking with ``instanceof''" , function() {
            var MyClass = classy.type( {} );

            expect(new MyClass instanceof MyClass).toBe(true);
        });

        it( "should call the user defined constructor when an instance is created" , function() {
            var typedef = {
                constructor: function() {
                },
            };

            spyOn(typedef, "constructor");

            var MyType   = classy.type(typedef);
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
                MyType = classy.type(typedef);
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
                MyType = classy.type(typedef);
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
                MyType = classy.type(typedef);
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
                superType = classy.type(superClass);
                subType   = classy.derive(superType, subClass);
                instance  = new subType;
            });

            it( "should allow base types to derive from one parent type" , function() {
                expect(instance instanceof subType).toEqual(true);
                expect(instance instanceof superType).toEqual(true);
            });
        });
    });

    return {};
});
