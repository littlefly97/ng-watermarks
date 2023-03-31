import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { tConfig, tDefConfig } from './ng-watermark.component';

@Directive({
  selector: '*[ngWatermark]',
})
export class NgWatermarkDirective implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('style.position') hostPosition = 'relative';
  @HostBinding('style.width') hostWidth = '100%';
  @HostBinding('style.height') hostHeight = '100%';
  constructor(private el: ElementRef, private renderer: Renderer2) {
    // console.log(el);
  }
  @Input() config: tConfig = {};

  @Input('title') title: string | TemplateRef<any> | null = null;

  defaultConfig: tDefConfig = {
    type: 'DOM',
    angle: 20,
    opacity: 0.2,
    font_size: '18px',
    rowsArray: [{}],
    colsArray: [{}],
  };

  private mutationObserver: MutationObserver | null = null;

  getRotatedDimensions(width: number, height: number, angle: number): { width: number; height: number } {
    const radians = (angle * Math.PI) / 180;
    const rotatedWidth = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
    const rotatedHeight = Math.abs(height * Math.cos(radians)) + Math.abs(width * Math.sin(radians));

    return { width: rotatedWidth, height: rotatedHeight };
  }
  domExtent = { width: 0, height: 0 };

  createWatermark() {
    const containerWidth = this.el.nativeElement.offsetWidth;
    const containerHeight = this.el.nativeElement.offsetHeight;

    // const xSpace = this.config.x_space ? this.convertToPixelValue(this.config.x_space) : 0;
    // const ySpace = this.config.y_space ? this.convertToPixelValue(this.config.y_space) : 0;

    const fontSize = this.config.font_size || '20px';
    const fontFamily = this.config.font || 'Arial';

    const textDimensions = this.measureTextSize(this.title as string, fontSize, fontFamily);
    const watermarkWidth = this.config.width ? parseInt(this.config.width, 10) : textDimensions.width;
    const watermarkHeight = this.config.height ? parseInt(this.config.height, 10) : textDimensions.height;
    this.domExtent = {
      width: watermarkWidth,
      height: watermarkHeight,
    };
    const rotatedDimensions = this.getRotatedDimensions(watermarkWidth, watermarkHeight, 0);
    const rowCount = this.config.rows || Math.ceil(containerHeight / (rotatedDimensions.height + this.getYSpacing()));
    const colCount = this.config.cols || Math.ceil(containerWidth / (rotatedDimensions.width + this.getXSpacing()));

    const gridContainer = this.createGridContainer(colCount, rowCount);
    this.renderer.appendChild(this.el.nativeElement, gridContainer);

    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        const watermark = this.createSingleWatermark(watermarkWidth, watermarkHeight);
        this.renderer.appendChild(gridContainer, watermark);
      }
    }
  }

  // convertToPixelValue(value: string | number): number {
  //   if (typeof value === 'number') {
  //     return value;
  //   }

  //   const hostElementFontSize = parseFloat(getComputedStyle(this.el.nativeElement).fontSize);
  //   const rootFontSize = parseFloat(getComputedStyle(this.renderer.selectRootElement('html')).fontSize);

  //   if (value.endsWith('px')) {
  //     return parseFloat(value);
  //   } else if (value.endsWith('rem')) {
  //     return parseFloat(value) * rootFontSize;
  //   } else if (value.endsWith('em')) {
  //     return parseFloat(value) * hostElementFontSize;
  //   }

  //   // 处理其他非像素单位的逻辑，如果需要

  //   return parseFloat(value);
  // }

  initMutationObserver() {
    this.mutationObserver = new MutationObserver((mutations) => {
      let watermarkRemoved = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const removedNodes = Array.from(mutation.removedNodes).filter(
            (node): node is HTMLElement => node instanceof HTMLElement
          );

          if (removedNodes.some((element) => element.classList.contains('watermark'))) {
            watermarkRemoved = true;
          }
        }
      }

      if (watermarkRemoved) {
        setTimeout(() => {
          this.removeWatermarks();
          this.createWatermark();
        }, 0);
      }
    });

    this.mutationObserver.observe(this.el.nativeElement, { childList: true, subtree: true });
  }

  removeWatermarks() {
    const watermarks = this.el.nativeElement.querySelectorAll('.watermark');
    watermarks.forEach((watermark: HTMLElement) => this.renderer.removeChild(this.el.nativeElement, watermark));
  }

  // grid
  createGridContainer(colCount: number, rowCount: number): HTMLElement {
    const gridContainer = this.renderer.createElement('div');
    this.renderer.addClass(gridContainer, 'watermark');
    this.renderer.setStyle(gridContainer, 'display', 'grid');
    this.renderer.setStyle(gridContainer, 'grid-template-columns', `repeat(${colCount}, auto)`);
    this.renderer.setStyle(gridContainer, 'grid-template-rows', `repeat(${rowCount}, auto)`);
    this.renderer.setStyle(gridContainer, 'grid-gap', `${this.getYSpacing()}px ${this.getXSpacing()}px`);
    this.renderer.setStyle(gridContainer, 'position', 'absolute');
    this.renderer.setStyle(gridContainer, 'width', '100%');
    this.renderer.setStyle(gridContainer, 'height', '100%');
    this.renderer.setStyle(gridContainer, 'overflow', 'hidden');
    return gridContainer;
  }

  measureTextSize(text: string, fontSize: string, fontFamily: string): { width: number; height: number } {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.font = `${fontSize} ${fontFamily}`;
    const metrics = context.measureText(text);

    const heightRatio = 1.2; // 大约为1.2的行高与字体大小的比例通常能产生比较好的结果
    const fontSizeValue = parseInt(fontSize, 10);
    const textHeight = fontSizeValue * heightRatio;

    return { width: metrics.width, height: textHeight };
  }

  createSingleWatermark(width: number, height: number): HTMLElement {
    const watermark = this.renderer.createElement('div');
    this.renderer.setStyle(watermark, 'width', `${width}px`);
    this.renderer.setStyle(watermark, 'height', `${height}px`);
    this.renderer.setStyle(watermark, 'opacity', '0.8');
    this.renderer.addClass(watermark, 'watermark');
    if (typeof this.title === 'string') {
      this.renderer.setStyle(watermark, 'background-image', `url("data:image/svg+xml,${this.generateWatermarkSVG()}")`);
      this.renderer.setStyle(watermark, 'background-repeat', 'no-repeat');
      this.renderer.setStyle(watermark, 'background-position', 'center');
      this.renderer.setStyle(watermark, 'background-size', 'contain');
    } else {
      const embeddedViewRef = (this.title as TemplateRef<any>).createEmbeddedView(null);
      embeddedViewRef.rootNodes.forEach((node) => {
        this.renderer.appendChild(watermark, node);
      });
    }

    this.renderer.setStyle(watermark, 'transform', `rotate(${this.config.angle}deg)`);
    return watermark;
  }

  getXSpacing(): number {
    if (typeof this.config.x_space === 'string') {
      return parseInt(this.config.x_space, 10);
    } else if (typeof this.config.x_space === 'number') {
      return this.config.x_space;
    } else {
      return 50;
    }
  }

  getYSpacing(): number {
    if (typeof this.config.y_space === 'string') {
      return parseInt(this.config.y_space, 10);
    } else if (typeof this.config.y_space === 'number') {
      return this.config.y_space;
    } else {
      return 50;
    }
  }

  generateWatermarkSVG(): string {
    const fontSize = this.config.font_size || '20px';
    const fontFamily = this.config.font || 'Arial';
    const fontSizeValue = parseInt(fontSize, 10);
    const yOffset = Math.round(fontSizeValue * 0.7);

    const encodedText = this.title;
    const svgText = `<text x="0" y="${yOffset}" font-size="${fontSize}" font-family="${fontFamily}">${encodedText}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.domExtent.width || '200'}" height="${
      this.domExtent.height || '100'
    }" fill-opacity="${this.config.opacity || 0.1}">${svgText}</svg>`;
    return encodeURIComponent(svg);
  }

  ngOnInit(): void {
    this.config = { ...this.defaultConfig, ...this.config };
    this.createWatermark();
  }
  ngAfterViewInit(): void {
    this.initMutationObserver();
  }

  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
}
