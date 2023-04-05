# ng-watermarks

一个简单的库，用于在 [Angular](https://angular.io/) 上实现水印。

简体中文 | [English](README.md)

## 📦 安装

```bash
npm install ng-watermark
```

```bash
yarn add ng-watermark
```

## 使用

你可以通过标签包裹的形式或者指令的形式来使用这个库。

### 输入参数

- `config`（配置对象）

  - `type?`：`'canvas' | 'DOM' | 'images'`（水印类型）
  - `angle?`：`number`（倾斜角度）
  - `x_space?`：`string | number`（水印之间的 X 轴间距,例如：'100px',100）
  - `y_space?`：`string | number`（水印之间的 Y 轴间距,例如：'100px',100）
  - `display?`：`''`（显示模式，铺满）
  - `opacity?`：`number`（水印的透明度）
  - `font_size?`：`string`（字体大小）
  - `font?`：`string`（字体系列）
  - `rows?`：`number`（水印的行数；如果为空或者为 0，则根据高度自动适配）
  - `cols?`：`number`（水印的列数；如果为空或者为 0，则根据宽度自动适配）
  - `width?`：`string`（水印的宽度；如果为空，则自动计算，例如：'100px'）
  - `height?`：`string`（水印的高度；如果为空，则自动计算）
  - `autoDetectWatermarkRemoval?`：`Boolean`（自动检测水印的删除）
  - `zIndex?`：`number`（水印的层级）

- `title`（水印的标题；可以是一个字符串或一个模板）

## 示例

### 使用标签包裹的形式

```html
<ng-watermark [config]="yourConfig" [title]="yourTitle">
  <!-- 在此处添加你的内容 -->
</ng-watermark>
```

### 使用指令的形式

```html
<div ngWatermark [config]="yourConfig" [title]="yourTitle">
  <!-- 在此处添加你的内容 -->
</div>
```

## 建议？改进？

如果你有 bug 或者改进的建议，请提交 issues 或者 pull requests。
