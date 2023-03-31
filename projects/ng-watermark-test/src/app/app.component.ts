import { Component, OnInit, ViewChild } from '@angular/core';
import { tConfig, type } from 'projects/ng-watermark/src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {}
  @ViewChild('titles') titles: any;
  config: tConfig = {
    type: 'canvas',
    // font_size: '2rem',
    // isCompleteWidth: false,
    opacity: 0.1,
    x_space: '50px',
  };
  title = 'ng-watermark-test';

  demo(): void {
    console.log(this.titles);
  }
}
