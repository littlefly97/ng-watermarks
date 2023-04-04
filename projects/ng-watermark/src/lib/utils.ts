import { tDefConfig } from './ng-watermark.component';

export class Utils {
  // measureTextSize(text: string, fontSize: string, fontFamily: string): { width: number; height: number } {
  //   const canvas = document.createElement('canvas');
  //   const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  //   context.font = `${fontSize} ${fontFamily}`;
  //   const metrics = context.measureText(text);

  //   const heightRatio = 1.2; // 大约为1.2的行高与字体大小的比例通常能产生比较好的结果
  //   const fontSizeValue = parseInt(fontSize, 10);
  //   const textHeight = fontSizeValue * heightRatio;

  //   return { width: metrics.width, height: textHeight };
  // }

  public static measureTextSize(text: string, fontSize: string, fontFamily: string): { width: number; height: number } {
    // 创建一个新的 <span> 元素
    const span = document.createElement('span');

    // 设置 <span> 元素的样式
    span.style.fontSize = fontSize;
    span.style.fontFamily = fontFamily;
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'nowrap';

    // 将文本设置为 <span> 元素的内容
    span.textContent = text;

    // 将 <span> 元素添加到 DOM 中
    document.body.appendChild(span);

    // 获取文本的宽度和高度
    const width = span.offsetWidth;
    const height = span.offsetHeight;

    // 从 DOM 中移除 <span> 元素
    document.body.removeChild(span);

    // 返回文本的宽度和高度
    return { width, height };
  }

  public static getRotatedDimensions(width: number, height: number, angle: number): { width: number; height: number } {
    const radians = (angle * Math.PI) / 180;
    const rotatedWidth = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
    const rotatedHeight = Math.abs(height * Math.cos(radians)) + Math.abs(width * Math.sin(radians));

    return { width: rotatedWidth, height: rotatedHeight };
  }

  static defaultConfig: tDefConfig = {
    type: 'DOM',
    angle: 20,
    opacity: 0.2,
    font_size: '18px',
    rowsArray: [],
    colsArray: [],
    autoDetectWatermarkRemoval: true,
    zIndex: 2,
  };
}
