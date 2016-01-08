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
            ],
            b: [
                'document',
                'querySelector:#test-span3',
                'innerText',
                'match:/Test, Span\/ 3/g',
                'getIndex:0'
            ],
            c: [
                'document',
                'querySelector:#test-span3',
                'innerText',
                'replace:/Test, Span\/ 3/g,Test Span 3'
            ],
            d: [
                'document',
                'querySelectorAll:.test-input-div',
                'map:querySelector:input',
                'map:value',
                'map:toInt'
            ],
            e: [
                'document',
                'querySelector:.test-match',
                'innerText',
                'match:match',
                'getIndex:0'
            ],
            f: [
                'document',
                'querySelectorAll:.test-match',
                'map:innerText',
                'map:match:match',
                'map:getIndex:0'
            ]
        });
        equal(extractedData.a, 1, 'selects child node, matches part of inner text and parses as int');
        equal(extractedData.b, 'Test, Span/ 3', 'regular expressions work with commas and slashes');
        equal(extractedData.c, 'Test Span 3', 'regular expression replace works with commas and slashes');
        deepEqual(extractedData.d, [1, 2, 3, 4], 'map calls work with sub commands which do and do not have arguments');
        equal(extractedData.e, 'match', 'arguments with the same name as a transformation get treated as arguments');
        deepEqual(extractedData.f, ['match', 'match'], 'array transformations treat arguments as transformations not static arguments');

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
