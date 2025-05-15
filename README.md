# Tweakpane item list plugin

Item list input plugin for [Tweakpane][tweakpane]. This plugin provides a dropdown list with the ability to select multiple items and manage them through a user-friendly interface.

## Features

- Dropdown list with modern styling
- Multiple item selection
- Drag and drop support for adding items
- Remove items with a single click
- Empty state handling
- Customizable drag and drop highlight color

## Installation

You can install [this package][npm-link] via NPM:

```sh
npm i tweakpane4-item-list-plugin
```

## Usage

You can use this plugin using these parameters:

```js
{
	view: 'item-list',
	options: [
		'option1',
		'option2',
		// ...
	]
}
```

### Customizing Drag and Drop Highlight

You can customize the drag and drop highlight color by setting a CSS variable:

```css
:root {
	--tp-plugin-item-list-dragging-color: #your-color;
}
```

## Example

```js
import {Pane} from 'tweakpane';
import * as TweakpaneItemPlugin from 'tweakpane4-item-list-plugin';

const pane = new Pane();
pane.registerPlugin(TweakpaneItemPlugin);

const params = {
	items: ['item_0', 'item_1', 'item_2'],
};

pane.addBinding(params, 'items', {
	view: 'item-list',
	options: [
		'item_0',
		'item_1',
		'item_2',
		'item_3',
		'item_4',
		'item_5',
		'item_6'
	]
});
```

## Development

To build the plugin:

```sh
npm install
npm run build
```

To run the development server:

```sh
npm run dev
```

[tweakpane]: https://github.com/cocopon/tweakpane/
