(function () {

    // These tests are only relevant in a browser environment
    var Composable = window.Composable,
        T = Composable.T;

    QUnit.module('Extraction');

    test('Extraction', function () {
        var extractedData = Composable({
            a: [
                'document',
                'querySelector:#test-div1',
                'innerText',
                'match:/\\d/',
                'getIndex:0',
                'toInt'
            ]
        });
        equal(extractedData.a, 1, 'selects child node, matches part of inner text and parses as int');

        extractedData = Composable({
            a: [
                T.document,
                T.querySelector('#test-div1'),
                T.innerText,
                T.match(/\d/),
                T.getIndex(0),
                T.toInt
            ]
        });
        equal(extractedData.a, 1, 'supports using callable transformations');

        extractedData = Composable({
            b: [
                'window',
                'getProperties:testData.test1.1'
            ]
        });
        equal(extractedData.b, 2, 'takes input data and gets properties and indices');
    });

}());
