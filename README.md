# elab

Multiple selection with just markup. CSS + JS ≃ 1.7 KB.

## Installation

### via [npm](https://www.npmjs.com/package/elab) (with a module bundler)

```sh
$ npm install elab
```

### via CDN ([jsDelivr](https://www.jsdelivr.com/package/npm/elab))

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/elab@0.0.1/simple/simple.css" />
<script src="https://cdn.jsdelivr.net/npm/elab@0.0.1/simple/simple.js"></script>
```

## Usage

```html
<!-- 1. Load CSS and JS. -->
<link rel="stylesheet" href="elab/simple.css" />
<script src="elab/simple.js"></script>

<!-- 2. Place an element having "elab" class and `tabindex` attribute, and listen to "change" or "close" event.
        Events can also be listened to using `element.addEventListener()`.
        The `event.detail.values` is an array having selected values. -->
<div
  class="elab"
  tabindex="0"
  onchange="console.log(arguments[0].detail.values)"
  onclose="console.log(arguments[0].detail.values)"
>

  <!-- 3. Place options having `data-value` with `data-selected` or `data-disabled` as appropriate. -->
  <ul>
    <li data-value="cupcake">Cupcake</li>
    <li data-value="donut">Donut</li>
    <li data-value="eclair" data-selected>Eclair</li>
    <li data-value="froyo" data-disabled>Froyo</li>
    <li data-value="gingerbread">Gingerbread</li>
    <li data-value="honeycomb">Honeycomb</li>
    <li data-value="ice" data-selected>Ice</li>

    <!-- 4. Placing an item having `data-placeholder` at last will display the placeholder when there is no selected item. -->
    <li data-placeholder>Select...</li>
  </ul>

  <!-- 5. Place an icon to indicate this is a dropdown, such as "▾". -->
  <div style="width: 1em;">▾</div>
</div>
```

## License

[WTFPL](http://www.wtfpl.net)
