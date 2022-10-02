import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTaskDeleteComponent } from './dialog-task-delete.component';

describe('DialogTaskDeleteComponent', () => {
  let component: DialogTaskDeleteComponent;
  let fixture: ComponentFixture<DialogTaskDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTaskDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTaskDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
