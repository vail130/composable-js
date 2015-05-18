(function () {

    // These tests are only relevant in a browser environment
    var Composable = window.Composable;

    QUnit.module('Transformations');

    test('window', function () {
        equal(Composable.transformations.window(), window, 'gets window object');
    });

    test('document', function () {
        equal(Composable.transformations.document(), document, 'gets document object');
    });

    test('toFloat', function () {
        equal(Composable.transformations.toFloat('12.34'), 12.34, 'parses strings into floats');
    });

    test('toInt', function () {
        equal(Composable.transformations.toInt('12.34'), 12, 'parses float strings into ints');
        equal(Composable.transformations.toInt('12'), 12, 'parses int strings into ints');
    });

    test('round', function () {
        equal(Composable.transformations.round(12.34), 12, 'rounds a number down');
        equal(Composable.transformations.round(12.54), 13, 'rounds a number up');
    });

    test('multiplyBy', function () {
        equal(Composable.transformations.multiplyBy(100)(12.34), 1234, 'multiplies by factor provided');
        equal(Composable.transformations.multiplyBy(20)('12.54'), false, 'returns false if value provided is not a number');
    });

    test('htmlToText', function () {
        equal(Composable.transformations.htmlToText('&amp;'), '&', 'converts html entities');
    });

    test('toString', function () {
        equal(Composable.transformations.toString(12.34), '12.34', 'transforms float to string');
    });

    test('trim', function () {
        equal(Composable.transformations.trim('  asdf  \n'), 'asdf', 'trim whitespace from string');
    });

    test('split', function () {
        deepEqual(Composable.transformations.split('\n')('asdf\nasdf'), ['asdf', 'asdf'], 'splits a string');
        deepEqual(Composable.transformations.split('\n', 1)('asdf\nasdf'), ['asdf'], 'splits a string with limit');
    });

    test('replace', function () {
        equal(Composable.transformations.replace(/\s+/, ' ')('asdf\n\tasdf'), 'asdf asdf', 'replaces a substring using a regular expression');
        equal(Composable.transformations.replace('\n', ' ')('asdf\nasdf'), 'asdf asdf', 'replaces a substring using a string');
    });

    test('match', function () {
        deepEqual(Composable.transformations.match(/[a-z]+(\d+)/)('asdf1234\nasdf'), ['asdf1234', '1234'], 'matches a substring using a regular expression');
    });

    test('getIndex', function () {
        equal(Composable.transformations.getIndex(1)([1, 2, 3]), 2, 'gets value at index of array');
    });

    test('slice', function () {
        deepEqual(Composable.transformations.slice(-1)(['a', 'b', 'c']), ['c'], 'slices an array');
        deepEqual(Composable.transformations.slice(-1)(document.querySelectorAll('.test-span'))[0].id, 'test-span2', 'slices a NodeList');
    });

    test('getProperty', function () {
        equal(Composable.transformations.getProperty('a')({a: 1, b: 2}), 1, 'gets value for a property in an object');
    });

}());
