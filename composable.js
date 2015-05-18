(function () {

    // Establish the root object, `window` (`self`) in the browser.
    // We use `self` instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self;

    // Transformation helper functions
    var isString = function (arg) {
            return typeof arg === 'string';
        },
        isNumber = function (arg) {
            return typeof arg === 'number';
        },
        isFunction = function (arg) {
            return typeof arg === 'function';
        },
        isArray = function (arg) {
            return Array.isArray ? Array.isArray(arg) : Object.prototype.toString.call(arg) === '[object Array]';
        },
        stringIsRegExp = function (string) {
            return /^\/(\S|\s)*\/[gimy]{0,4}$/.test(string);
        },
        toRegExp = function (pattern) {
            var patternArray = pattern.split('/');
            return new RegExp(patternArray[1], patternArray[2]);
        },
        mapObject = function (object, func) {
            var key, newObject = {};
            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    newObject[key] = func(key, object[key]);
                }
            }
            return newObject;
        },
        filterObject = function (object, func) {
            var key, newObject = {};
            for (key in object) {
                if (object.hasOwnProperty(key) && func(key, object[key])) {
                    newObject[key] = object[key];
                }
            }
            return newObject;
        },
        cachedQueryFactory = function (cacheKey) {
            return function (selector) {
                var _this = this;
                if (!_this.hasOwnProperty('cache')) {
                    _this.cache = {};
                }
                if (!_this.cache.hasOwnProperty(cacheKey)) {
                    _this.cache[cacheKey] = {};
                }
                return function (node) {
                    if (!node) {
                        return null;
                    }
                    if (!_this.cache[cacheKey].hasOwnProperty(node)) {
                        _this.cache[cacheKey][node] = {};
                    }
                    if (!_this.cache[cacheKey][node].hasOwnProperty(selector)) {
                        _this.cache[cacheKey][node][selector] = node[cacheKey](selector);
                    }
                    return _this.cache[cacheKey][node][selector];
                };
            };
        };

    // Composable transformations
    var transformations = {
        // Global object getters
        window: function () {
            return root;
        },
        document: function () {
            return root.document;
        },

        // DOM node transformations
        querySelectorAll: cachedQueryFactory('querySelectorAll'),
        querySelector: cachedQueryFactory('querySelector'),
        innerHTML: function (node) {
            return node && node.innerHTML;
        },
        innerText: function (node) {
            return node && (node.innerText || node.textContent);
        },
        value: function (node) {
            return node && node.value;
        },
        getAttribute: function (attr) {
            return function (node) {
                return node && node.getAttribute && node.getAttribute(attr);
            };
        },

        // Number transformations
        toInt: function (item) {
            return isString(item) && parseInt(item, 10);
        },
        toFloat: function (item) {
            return isString(item) && parseFloat(item);
        },
        round: function (item) {
            return isNumber(item) && Math.round(item);
        },
        multiplyBy: function (factor) {
            return function (number) {
                return isNumber(number) && factor * number;
            };
        },

        // String transformations
        htmlToText: function (html) {
            var div = root.document.createElement('div');
            div.innerHTML = html;
            return div.firstChild.nodeValue + String();
        },
        toString: function (item) {
            return item + String();
        },
        trim: function (text) {
            return isString(text) && text.trim();
        },
        split: function (delimeter, limit) {
            var args = [delimeter];
            if (typeof limit !== 'undefined') {
                args.push(parseInt(limit, 10));
            }
            return function (text) {
                return isString(text) && text.split.apply(text, args);
            };
        },
        replace: function (pattern, replacement) {
            pattern = isString(pattern) && stringIsRegExp(pattern) ? toRegExp(pattern) : pattern;
            return function (text) {
                return isString(text) && text.replace(pattern, replacement);
            };
        },
        match: function (pattern) {
            pattern = isString(pattern) && stringIsRegExp(pattern) ? toRegExp(pattern) : pattern;
            return function (text) {
                return isString(text) && text.match(pattern);
            };
        },

        // Array transformations
        getIndex: function (index) {
            index = parseInt(index, 10);
            return function (array) {
                return isArray(array) && array.length > index && array[index];
            };
        },
        slice: function (start, stop) {
            var args = [parseInt(start, 10)];
            if (typeof stop !== 'undefined') {
                args.push(parseInt(stop, 10));
            }
            return function (array) {
                // Slice needs to work on NodeList instances
                return array && Array.prototype.slice.apply(array, args);
            };
        },

        // Object transformations
        getProperty: function (property) {
            return function (object) {
                return object && object[property];
            };
        }
    };

    // Allow usage as a function without `new` operator
    var Composable = function (config) {
        if (!(this instanceof Composable)) {
            return new Composable(config);
        }
        return this.extract(config);
    };

    // Put transformations on Composable object for global referencing without `new` operator
    Composable.prototype.T = Composable.T = transformations;

    // Extract and format data from the DOM based on config
    Composable.prototype.extract = function (config) {
        var _this = this;

        var filteredConfig = filterObject(config, function (key, spec) {
            return isArray(spec);
        });

        return mapObject(filteredConfig, function (key, spec) {
            var i, item = null;
            for (i = 0; i < spec.length; i += 1) {
                item = _this.applyTransformation(item, spec[i]);
            }
            return item;
        });
    };

    // Apply each transformation to the item, in series
    Composable.prototype.applyTransformation = function (item, transformation) {
        var transformationFunction = null;

        if (isString(transformation)) {
            if (this.T.hasOwnProperty(transformation)) {
                transformationFunction = this.T[transformation];
            } else if (this.T.hasOwnProperty(transformation.split(':', 1)[0])) {
                transformationFunction = this.parseTransformation(transformation);
            }
        } else if (isFunction(transformation)) {
            transformationFunction = transformation;
        }

        if (!transformationFunction) {
            throw 'Transformation ' + transformation + ' not implemented';
        }

        return transformationFunction(item);
    };

    // If a transformation has static arguments, use them to make a transformation
    // function to apply to the item
    Composable.prototype.parseTransformation = function (transformationString) {
        var transformationArray = transformationString.split(':');
        var transformationName = transformationArray.shift();
        var transformationArgs = transformationArray.join(':').split(',');

        // Share context (`this`) between current instance and transformation factory
        return this.T[transformationName].apply(this, transformationArgs);
    };

    Composable.VERSION = '0.3.0';

    // Make the object globally accessible
    root.Composable = Composable;

    // Define it for AMD
    if (typeof define === 'function' && define.amd) {
        define('composable', [], function () {
            return Composable;
        });
    }

}());
