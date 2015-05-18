(function () {

    // These tests are only relevant in a browser environment
    var Composable = window.Composable;

    QUnit.module('Extraction');

    test('Extraction', function () {
        var extractedData = Composable({
            a: [
                'document',
                'querySelector:#qunit-fixture',
                'querySelector:#test-div1',
                'innerText',
                'match:/\\d/',
                'getIndex:0',
                'toInt'
            ]
        });
        equal(extractedData.a, 1, 'selects child node, matches part of inner text and parses as int');

        extractedData = Composable({
            b: [
                'window',
                'getProperty:testData',
                'getProperty:test1',
                'getIndex:1'
            ]
        });
        equal(extractedData.b, 2, 'takes input data and gets properties and indices');
    });

}());
