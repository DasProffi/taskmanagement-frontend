import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskUpdateViewComponent } from './task-update-view.component';

describe('TaskUpdateViewComponent', () => {
  let component: TaskUpdateViewComponent;
  let fixture: ComponentFixture<TaskUpdateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskUpdateViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskUpdateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
