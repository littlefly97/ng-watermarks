import { NgModule } from '@angular/core';
import { NgWatermarkComponent } from './ng-watermark.component';
import { NgWatermarkDirective } from './ng-watermark.directive';
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [NgWatermarkComponent, NgWatermarkDirective],
  imports: [CommonModule],
  exports: [NgWatermarkComponent, NgWatermarkDirective],
})
export class NgWatermarkModule {}
