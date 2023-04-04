import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { tConfig, tDefConfig } from './ng-watermark.component';
import { Utils } from './utils';

@Directive({
  selector: '*[ngWatermark]',
})
export class NgWatermarkDirective implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('style.position') hostPosition = 'relative';
  @HostBinding('style.height') hostHeight = '100%';
  constructor(private el: ElementRef, private renderer: Renderer2) {
    // console.log(el);
  }
  @Input() config: tConfig = {};

  @Input('title') title: string | TemplateRef<any> | null = null;

  private mutationObserver: MutationObserver | null = null;

  domExtent = { width: 0, height: 0 };

  createWatermark() {
    const containerWidth = this.el.nativeElement.offsetWidth;
    const containerHeight = this.el.nativeElement.offsetHeight;
    const fontSize = this.config.font_size || '20px';
    const fontFamily = this.config.font || 'Arial';

    const textDimensions = Utils.measureTextSize(this.title as string, fontSize, fontFamily);
    const watermarkWidth = this.config.width ? parseInt(this.config.width, 10) : textDimensions.width;
    const watermarkHeight = this.config.height ? parseInt(this.config.height, 10) : textDimensions.height;
    this.domExtent = {
      width: watermarkWidth,
      height: watermarkHeight,
    };
    const rotatedDimensions = Utils.getRotatedDimensions(watermarkWidth, watermarkHeight, 0);
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
    this.renderer.setStyle(gridContainer, 'overflow', 'hidden');
    this.renderer.setStyle(gridContainer, 'z-index', this.config.zIndex);
    this.renderer.setStyle(gridContainer, 'pointer-events', `none`);
    return gridContainer;
  }

  createSingleWatermark(width: number, height: number): HTMLElement {
    const watermark = this.renderer.createElement('div');
    this.renderer.setStyle(watermark, 'width', `${width}px`);
    this.renderer.setStyle(watermark, 'height', `${height}px`);
    this.renderer.setStyle(watermark, 'pointer-events', `none`);
    this.renderer.addClass(watermark, 'watermark');
    if (typeof this.title === 'string') {
      this.renderer.setStyle(
        watermark,
        'background-image',
        `url("data:image/svg+xml,${this.generateWatermarkSVG(this.title)}")`
      );
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
      return 0;
    }
  }

  getYSpacing(): number {
    if (typeof this.config.y_space === 'string') {
      return parseInt(this.config.y_space, 10);
    } else if (typeof this.config.y_space === 'number') {
      return this.config.y_space;
    } else {
      return 0;
    }
  }

  generateWatermarkSVG(title: string | number): string {
    const fontSize = this.config.font_size || '20px';
    const fontFamily = this.config.font || 'Arial';
    const fontSizeValue = parseInt(fontSize, 10);
    const yOffset = Math.round(fontSizeValue * 0.7);

    const encodedText = title;
    const svgText = `<text x="0" y="${yOffset}" font-size="${fontSize}" font-family="${fontFamily}">${encodedText}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.domExtent.width || '200'}" height="${
      this.domExtent.height || '100'
    }" fill-opacity="${this.config.opacity || 0.1}">${svgText}</svg>`;
    return encodeURIComponent(svg);
  }

  ngOnInit(): void {
    this.config = { ...Utils.defaultConfig, ...this.config };
    this.createWatermark();
  }
  ngAfterViewInit(): void {
    if (this.config.autoDetectWatermarkRemoval) this.initMutationObserver();
  }

  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
}
