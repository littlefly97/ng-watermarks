import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgWatermarkComponent } from './ng-watermark.component';

describe('NgWatermarkComponent', () => {
  let component: NgWatermarkComponent;
  let fixture: ComponentFixture<NgWatermarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgWatermarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgWatermarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
