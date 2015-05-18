(function () {

    // These tests are only relevant in a browser environment
    var Composable = window.Composable;

    QUnit.module('Transformations');

    test('window', function () {
        equal(Composable.T.window(), window, 'gets window object');
    });

    test('document', function () {
        equal(Composable.T.document(), document, 'gets document object');
    });

    test('toFloat', function () {
        equal(Composable.T.toFloat('12.34'), 12.34, 'parses strings into floats');
    });

    test('toInt', function () {
        equal(Composable.T.toInt('12.34'), 12, 'parses float strings into ints');
        equal(Composable.T.toInt('12'), 12, 'parses int strings into ints');
    });

    test('round', function () {
        equal(Composable.T.round(12.34), 12, 'rounds a number down');
        equal(Composable.T.round(12.54), 13, 'rounds a number up');
    });

    test('multiplyBy', function () {
        equal(Composable.T.multiplyBy(100)(12.34), 1234, 'multiplies by factor provided');
        equal(Composable.T.multiplyBy(20)('12.54'), false, 'returns false if value provided is not a number');
    });

    test('htmlToText', function () {
        equal(Composable.T.htmlToText('&amp;'), '&', 'converts html entities');
    });

    test('toString', function () {
        equal(Composable.T.toString(12.34), '12.34', 'transforms float to string');
    });

    test('trim', function () {
        equal(Composable.T.trim('  asdf  \n'), 'asdf', 'trim whitespace from string');
    });

    test('split', function () {
        deepEqual(Composable.T.split('\n')('asdf\nasdf'), ['asdf', 'asdf'], 'splits a string');
        deepEqual(Composable.T.split('\n', 1)('asdf\nasdf'), ['asdf'], 'splits a string with limit');
    });

    test('replace', function () {
        equal(Composable.T.replace(/\s+/, ' ')('asdf\n\tasdf'), 'asdf asdf', 'replaces a substring using a regular expression');
        equal(Composable.T.replace('\n', ' ')('asdf\nasdf'), 'asdf asdf', 'replaces a substring using a string');
    });

    test('match', function () {
        deepEqual(Composable.T.match(/[a-z]+(\d+)/)('asdf1234\nasdf'), ['asdf1234', '1234'], 'matches a substring using a regular expression');
    });

    test('getIndex', function () {
        equal(Composable.T.getIndex(1)([1, 2, 3]), 2, 'gets value at index of array');
    });

    test('slice', function () {
        deepEqual(Composable.T.slice(-1)(['a', 'b', 'c']), ['c'], 'slices an array');
        deepEqual(Composable.T.slice(-1)(document.querySelectorAll('.test-span'))[0].id, 'test-span2', 'slices a NodeList');
    });

    test('getProperty', function () {
        equal(Composable.T.getProperty('a')({a: 1, b: 2}), 1, 'gets value for a property in an object');
    });

}());
