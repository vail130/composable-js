(function () {

    var isString = function (text) {
            return typeof text === 'string';
        },
        isNumber = function (number) {
            return typeof number === 'number';
        },
        isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        },
        stringIsRegExp = function (string) {
            return (/^\/(\S|\s)*\/[gimy]{0,4}$/).test(string);
        },
        toRegExp = function (pattern) {
            var patternArray = pattern.split('/');
            return new RegExp(patternArray[1], patternArray[2]);
        },
        transformations = {
            // DOM node transformations
            querySelectorAll: function (selector) {
                return function (node) {
                    return node && node.querySelectorAll(selector);
                };
            },
            querySelector: function (selector) {
                return function (node) {
                    return node && node.querySelector(selector);
                };
            },
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
                var div = this.document.createElement('div');
                div.innerHTML = html;
                return (div.firstChild.nodeValue + String());
            },
            toString: function (item) {
                return item + String();
            },
            trim: function (text) {
                return isString(text) && text.trim();
            },
            split: function (delimeter, limit) {
                var args = [delimeter];
                if (limit !== undefined) {
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
            toArray: function (list) {
                return Array.prototype.slice.call(list);
            },
            slice: function (start, stop) {
                var args = [parseInt(start, 10)];
                if (stop !== undefined) {
                    args.push(parseInt(stop, 10));
                }
                return function (array) {
                    return array.slice.apply(array, args);
                };
            }
        },
        DomExtractor = function (rootNode, config) {
            if (!(this instanceof DomExtractor)) {
                return new DomExtractor(rootNode, config);
            }
            this.rootNode = rootNode;
            this.document = this.rootNode.ownerDocument || this.rootNode;
            return this.extract(config);
        };

	DomExtractor.prototype.transformations = DomExtractor.transformations = transformations;

    DomExtractor.prototype.extract = function (config) {
        var key, spec, output = {}, memoizedSelections = {};
        for (key in config) {
            if (config.hasOwnProperty(key)) {
                spec = config[key];

                if (!spec.condition || spec.condition()) {
                    output[key] = this.rootNode;

                    if (spec.selector) {
                        if (!memoizedSelections.hasOwnProperty(spec.selector)) {
                            memoizedSelections[spec.selector] = output[key].querySelector(spec.selector);
                        }
                        output[key] = memoizedSelections[spec.selector];
                    }

                    if (spec.transformations) {
                        output[key] = this.applyTransformations(spec.transformations, output[key]);
                    }
                }
            }
        }
        return output;
    };

    DomExtractor.prototype.applyTransformations = function (transformations, item) {
        var i, transformationArray, transformationName, transformationArgs, transformation;
        for (i = 0; i < transformations.length; i += 1) {
            if (typeof transformations[i] === 'function') {
                item = transformations[i](item);
            } else if (this.transformations.hasOwnProperty(transformations[i])) {
                item = this.transformations[transformations[i]](item);
            } else if (transformations[i].indexOf(':') > -1) {
                transformationArray = transformations[i].split(':');
                transformationName = transformationArray.shift();
                transformationArgs = transformationArray.join(':').split(',');
                transformation = this.transformations[transformationName].apply(this, transformationArgs);
                item = transformation(item);
            } else {
                throw 'Transformation ' + transformations[i] + ' not implemented';
            }
        }
        return item;
    };

    // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
    // We use `self` instead of `window` for `WebWorker` support.
    var root = (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global);

    // Export the DomExtractor object for **Node.js**, with
    // backwards-compatibility for their old module API. If we're in
    // the browser, add `DomExtractor` as a global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = DomExtractor;
        }
        exports.domExtractor = DomExtractor;
    } else {
        root.domExtractor = DomExtractor;
    }

    if (typeof define === 'function' && define.amd) {
        define('domextractor', [], function () {
            return DomExtractor;
        });
    }

}());
