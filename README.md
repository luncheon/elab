# elab

Multiple selection with just markup.

[Demo](https://luncheon.github.io/elab/index.html) / [CodePen](https://codepen.io/luncheon/pen/qBqQMjg)

## Installation

### via [npm](https://www.npmjs.com/package/elab) (with a module bundler)

```sh
$ npm install elab
```

```js
import 'elab/simple/simple.css' // or 'elab/material/material.css'
import 'elab/simple/simple.js'  // or 'elab/material/material.js'
```

### via CDN ([jsDelivr](https://www.jsdelivr.com/package/npm/elab))

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/elab@0.3.0/simple/simple.css" />
<script src="https://cdn.jsdelivr.net/npm/elab@0.3.0/simple/simple.js"></script>
<!-- or
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/elab@0.3.0/material/material.css" />
<script src="https://cdn.jsdelivr.net/npm/elab@0.3.0/material/material.js"></script>
-->
```

### Download

[simple.css](https://cdn.jsdelivr.net/npm/elab@0.3.0/simple/simple.css)
[simple.js](https://cdn.jsdelivr.net/npm/elab@0.3.0/simple/simple.js)

[material.css](https://cdn.jsdelivr.net/npm/elab@0.3.0/material/material.css)
[material.js](https://cdn.jsdelivr.net/npm/elab@0.3.0/material/material.js)

## Usage

```html
<!-- 1. Load CSS and JS. -->
<link rel="stylesheet" href="elab/simple.css" />
<script src="elab/simple.js"></script>

<!-- 2. Place an element having "elab" class and `tabindex` attribute.
        [Optional] Add "elab-wrap" class to apply word-wrap.
        [Optional] Listen to "change" and "close" events using `addEventListener()` or `on-` attributes.
        `event.detail.values` is an array having selected values. -->
<div
  class="elab elab-wrap"
  tabindex="0"
  onchange="console.log(arguments[0].detail.values)"
  onclose="console.log(arguments[0].detail.values)"
>
  <ul>
    <!-- 3. [Optional] Place an item having `data-selected-all` to indicate or toggle all items. -->
    <li data-selected-all>All</li>

    <!-- 4. Place items having `data-value` with `data-selected` or `data-disabled` as appropriate. -->
    <li data-value="cupcake">Cupcake</li>
    <li data-value="donut">Donut</li>
    <li data-value="eclair" data-selected>Eclair</li>
    <li data-value="froyo" data-disabled>Froyo</li>
    <li data-value="gingerbread">Gingerbread</li>
    <li data-value="honeycomb">Honeycomb</li>
    <li data-value="ice" data-selected>Ice</li>

    <!-- 5. [Optional] Place an item having `data-placeholder` at last to display the placeholder. -->
    <li data-placeholder>Select...</li>
  </ul>

  <!-- 6. [Optional] Place an icon to indicate this is a dropdown, such as "▾". -->
  <div style="padding: 0 0.5em;">▾</div>
</div>
```

## License

[WTFPL](http://www.wtfpl.net)
