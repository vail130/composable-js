(function () {

    // These tests are only relevant in a browser environment
    var domExtractor = window.domExtractor;

    QUnit.module('Extraction');

    test('Extraction', function () {
        var extractedData = domExtractor(window.document, {
            a: {
                selector: '#qunit-fixture',
                transformations: [
                    'querySelector:#test-div1',
                    'innerText',
                    'match:/\\d/',
                    'getIndex:0',
                    'toInt'
                ]
            }
        });

        equal(extractedData.a, 1, 'selects child node, matches part of inner text and parses as int');
    });

}());
