import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgWatermarkModule } from 'ng-watermark';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgWatermarkModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
