(function () {

    // These tests are only relevant in a browser environment
    var domExtractor = window.domExtractor;

    QUnit.module('Transformations');

    test('toFloat', function () {
        equal(domExtractor.transformations.toFloat('12.34'), 12.34, 'parses strings into floats');
    });

    test('toInt', function () {
        equal(domExtractor.transformations.toInt('12.34'), 12, 'parses float strings into ints');
        equal(domExtractor.transformations.toInt('12'), 12, 'parses int strings into ints');
    });

    test('round', function () {
        equal(domExtractor.transformations.round(12.34), 12, 'rounds a number down');
        equal(domExtractor.transformations.round(12.54), 13, 'rounds a number up');
    });

    test('multiplyBy', function () {
        equal(domExtractor.transformations.multiplyBy(100)(12.34), 1234, 'multiplies by factor provided');
        equal(domExtractor.transformations.multiplyBy(20)('12.54'), false, 'returns false if value provided is not a number');
    });

    test('htmlToText', function () {
        equal(domExtractor.transformations.htmlToText('&amp;'), '&', 'converts html entities');
    });

    test('toString', function () {
        equal(domExtractor.transformations.toString(12.34), '12.34', 'transforms float to string');
    });

    test('trim', function () {
        equal(domExtractor.transformations.trim('  asdf  \n'), 'asdf', 'trim whitespace from string');
    });

    test('split', function () {
        deepEqual(domExtractor.transformations.split('\n')('asdf\nasdf'), ['asdf', 'asdf'], 'splits a string');
        deepEqual(domExtractor.transformations.split('\n', 1)('asdf\nasdf'), ['asdf'], 'splits a string with limit');
    });

    test('replace', function () {
        equal(domExtractor.transformations.replace(/\s+/, ' ')('asdf\n\tasdf'), 'asdf asdf', 'replaces a substring using a regular expression');
        equal(domExtractor.transformations.replace('\n', ' ')('asdf\nasdf'), 'asdf asdf', 'replaces a substring using a string');
    });

    test('match', function () {
        deepEqual(domExtractor.transformations.match(/[a-z]+(\d+)/)('asdf1234\nasdf'), ['asdf1234', '1234'], 'matches a substring using a regular expression');
    });

    test('getIndex', function () {
        equal(domExtractor.transformations.getIndex(1)([1, 2, 3]), 2, 'gets value at index of array');
    });

    test('slice', function () {
        deepEqual(domExtractor.transformations.slice(-1)(['a', 'b', 'c']), ['c'], 'slices an array');
        deepEqual(domExtractor.transformations.slice(-1)(document.querySelectorAll('.test-span'))[0].id, 'test-span2', 'slices a NodeList');
    });

}());
