import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Task} from '../../../models/task.model';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.css']
})

export class TaskCreationComponent implements OnInit {
  task: Task = Task.emptyTask();

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const rootTaskID = this.route.snapshot.paramMap.get('parentID');
    const name = this.route.snapshot.paramMap.get('name');
    const description = this.route.snapshot.paramMap.get('description');

    this.task.name = name != undefined ? name : this.task.name;
    this.task.description = description != undefined ? description : this.task.description;
    this.task.parentTaskID = rootTaskID != undefined ? Number(rootTaskID) : this.task.parentTaskID;
  }
}
