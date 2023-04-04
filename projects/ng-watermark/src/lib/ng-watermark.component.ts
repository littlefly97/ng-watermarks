import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
export enum type {
  canvas,
  DOM,
  images,
}
export interface tConfig {
  type?: 'canvas' | 'DOM' | 'images';
  angle?: number; //倾斜角度
  x_space?: string | number; //水印之间的X轴间距
  y_space?: string | number; //水印之间Y轴间距
  display?: ''; //显示模式，铺满
  opacity?: number;
  font_size?: string;
  font?: string;
  rows?: number; //水印的行数，如果为空或者为0，则根据高度自动适配
  cols?: number; //水印的列数，如果为空或者为0，则根据宽度自动适配
  width?: string; //水印的宽度，如果为空，则自动计算，eg:100px,1rem,1vh
  height?: string; //水印的高度，如果为空，则自动计算
  autoDetectWatermarkRemoval?: Boolean; //自动检测水印的删除
  zIndex?: number; //水印的层级
}

export interface tDefConfig extends tConfig {
  rowsArray?: any[];
  colsArray?: any[];
}

export interface tPropsUnit {
  [unit: string]: {
    defaultUnit: string;
    checkType: string[];
  };
}

@Component({
  selector: 'ng-watermark',
  exportAs: 'ngWatermark',
  template: `
    <div class="mainDOM">
      <div style="height: 100%" #content>
        <ng-content></ng-content>
      </div>
      <div class="mainDOM__watermark" #watermarkDOM>
        <ng-container>
          <div class="mainDOM__watermark__list" *ngFor="let item of defaultConfig.rowsArray">
            <span
              [ngStyle]="{
                transform: 'rotate(-' + this.defaultConfig.angle + 'deg)',
                opacity: this.defaultConfig.opacity,
                'font-size': this.defaultConfig.font_size,
                'font-family': this.defaultConfig.font,
                display: 'inline-block',
                'padding-top': this.defaultConfig.y_space,
                'padding-left': this.defaultConfig.x_space,
                'padding-bottom': this.defaultConfig.y_space,
                'padding-right': this.defaultConfig.x_space,
                flex: '0 0 10%'
              }"
              #waterItem
              *ngFor="let item of defaultConfig.colsArray"
            >
              <ng-container
                *ngIf="isTemplateRef; else titleString"
                [ngTemplateOutlet]="titleTemplate"
                [ngTemplateOutletContext]="{ $implicit: config }"
              ></ng-container>
              <ng-template #titleString>
                {{ title }}
              </ng-template>
            </span>
          </div>
        </ng-container>
      </div>
    </div>

    <!--  -->
  `,

  styleUrls: ['./ng-watermark.scss'],
})
export class NgWatermarkComponent implements OnInit {
  constructor(private viewContainer: ViewContainerRef, private rd2: Renderer2) {}
  @Input() config: tConfig = {};
  protected isTemplateRef: boolean = false;
  protected titleTemplate: TemplateRef<void> | null = null;
  @Input() title: string | TemplateRef<void> | null = null;
  defaultConfig: tDefConfig = {
    type: 'DOM',
    angle: 20,
    opacity: 0.2,
    font_size: '1rem',
    rowsArray: [{}],
    colsArray: [{}],
  };
  propsUnit: tPropsUnit = {
    x_space: {
      defaultUnit: 'px',
      checkType: ['number'],
    },
    y_space: {
      defaultUnit: 'px',
      checkType: ['number'],
    },
    font_size: {
      defaultUnit: 'px',
      checkType: ['number'],
    },
  };
  width: string | null = `0px`;
  height: string | null = `0px`;
  waterLength: number = 1;
  @ViewChild('content') content: ElementRef = new ElementRef(null);
  @ViewChild('watermarkDOM') watermarkDOM: ElementRef = new ElementRef(null);
  @ViewChild('waterItem') waterItem: ElementRef = new ElementRef(null);
  ngOnInit(): void {
    this.isTemplateRef = this.title instanceof TemplateRef;
    this.titleTemplate = this.title instanceof TemplateRef ? this.title : null;

    // for (let configItem in this.config) {
    //   if (objectUnit.isValidKey(configItem, this.defaultConfig) && objectUnit.isValidKey(configItem, this.config)) {
    //     if (Tools.isNumber(this.config[configItem])) {
    //       this.config[configItem] = Number(this.config[configItem]);
    //     }
    //     if (
    //       this.propsUnit[configItem] &&
    //       this.propsUnit[configItem].checkType.includes(typeof this.config[configItem])
    //     ) {
    //       (this.config[configItem] as any) = `${this.config[configItem]}${this.propsUnit[configItem].defaultUnit}`;
    //     }

    //     this.defaultConfig[configItem] = this.config[configItem];
    //   }
    // }
    this.defaultConfig = {
      ...this.defaultConfig,
      ...this.config,
    };
  }

  counter(i: number | undefined): any[] {
    return typeof i === 'number' && !isNaN(i) ? new Array(i).fill({}) : [];
  }

  // ngAfterViewInit(): void {
  //   this.width = `${this.getContentLength().width}px`;
  //   this.height = `${this.getContentLength().height}px`;
  //   const margin = getComputedStyle(this.content.nativeElement.lastChild).margin;
  //   this.rd2.setStyle(this.watermarkDOM.nativeElement, 'margin', margin);
  //   this.rd2.setStyle(this.watermarkDOM.nativeElement, 'margin-top', 0);

  //   const [waterItemWidth, waterItemHeight] = [
  //     this.waterItem?.nativeElement?.offsetWidth.toFixed(3).slice(0, -1),
  //     this.waterItem?.nativeElement?.offsetHeight.toFixed(3).slice(0, -1),
  //   ];
  //   this.defaultConfig.cols =
  //     this.config.cols ?? Number((this.getContentLength().width / waterItemWidth).toFixed(1).slice(0, -1));
  //   this.defaultConfig.rows =
  //     this.config.rows ?? Number((this.getContentLength().height / waterItemHeight).toFixed(1).slice(0, -1));
  //   this.waterLength = this.defaultConfig.rows * this.defaultConfig.cols;
  //   this.defaultConfig.colsArray = this.counter(this.defaultConfig.cols)
  //   this.defaultConfig.rowsArray = this.counter(this.defaultConfig.rows)
  //   console.log(this.defaultConfig)
  // }

  getContentLength() {
    let height = this.content.nativeElement.children[0]?.offsetHeight ?? null;
    let width = this.content.nativeElement.children[0]?.offsetWidth ?? null;
    return { height, width };
  }
}
