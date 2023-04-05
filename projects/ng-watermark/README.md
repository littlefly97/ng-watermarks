# ng-watermarks

A simple library for implementing watermarks in [Angular](https://angular.io/).

English | [简体中文](README-zh_CN.md)

## 📦 Install

```bash
npm install ng-watermark
```

```bash
yarn add ng-watermark
```

## Usage

You can use this library with both element wrappers and directives.

### Input Parameters

- `config` (configuration object)

  - `type?`: `'canvas' | 'DOM' | 'images'` (type of watermark)
  - `angle?`: `number` (tilt angle)
  - `x_space?`: `string | number` (horizontal space between watermarks, e.g., '100px',100)
  - `y_space?`: `string | number` (vertical space between watermarks,e.g., '100px',100)
  - `display?`: `''` (display mode, full coverage)
  - `opacity?`: `number` (opacity of the watermark)
  - `font_size?`: `string` (font size)
  - `font?`: `string` (font family)
  - `rows?`: `number` (number of watermark rows; if empty or 0, it adapts automatically to the height)
  - `cols?`: `number` (number of watermark columns; if empty or 0, it adapts automatically to the width)
  - `width?`: `string` (width of the watermark; if empty, it calculates automatically, e.g., '100px')
  - `height?`: `string` (height of the watermark; if empty, it calculates automatically)
  - `autoDetectWatermarkRemoval?`: `Boolean` (automatically detects watermark removal)
  - `zIndex?`: `number` (z-index of the watermark)

- `title` (title of the watermark; can be a string or a template)

## Examples

### Using an element wrapper

```html
<ng-watermark [config]="yourConfig" [title]="yourTitle">
  <!-- Your content here -->
</ng-watermark>
```

### Using a directive

```html
<div ngWatermark [config]="yourConfig" [title]="yourTitle">
  <!-- Your content here -->
</div>
```

## Suggestions? Improvements?

Please open issues or pull requests if you have bugs or improvements.
