import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListTileComponent } from './task-list-tile.component';

describe('TaskListTileComponent', () => {
  let component: TaskListTileComponent;
  let fixture: ComponentFixture<TaskListTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskListTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
