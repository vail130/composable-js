![Build Status](https://travis-ci.org/vail130/composable-js.svg?branch=master)

# Composable
A JS library to select, transform and format data, declaratively.

# Example
```html
<div id="fixture">
    <input type="text" name="a" value="1">

    <div class="test-div" id="test-div1">Test Div 1</div>
    <div class="test-div" id="test-div2">Test Div 2</div>
    <span class="test-span" id="test-span1">Test Span 1</span>
    <span class="test-span" id="test-span2">Test Span 2</span>
</div>

<script>
    window.testData = {
        test1: [1, 2, 3],
        test2: {
            a: 1,
            b: 2,
            c: 3
        },
        test3: 11
    }
</script>
```

```js
var data = window.Composable({
    divNumber: [
        'document',
        'querySelector:#test-div1',
        'innerText',
        'match:/\\d/',
        'getIndex:0',
        'toInt'
    ],
    testValue: [
        'window',
        'getProperties:testData.test1.1',
    ]
});

data.divNumber === 1; // true
data.testValue === 2; // true
```

# Install and Test
```bash
make install
make test
```
