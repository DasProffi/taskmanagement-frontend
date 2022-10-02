import {Component, OnInit} from '@angular/core';
import {Task} from "../../../models/task.model";
import {ActivatedRoute} from "@angular/router";
import {TaskHandlerService} from "../../../services/task-handler.service";

@Component({
  selector: 'app-task-update-view',
  templateUrl: './task-update-view.component.html',
  styleUrls: ['./task-update-view.component.css']
})
export class TaskUpdateViewComponent implements OnInit {
  taskPromise: Promise<Task | undefined> | undefined;

  private _id: number = -1;

  constructor(private taskHandlerService: TaskHandlerService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._id = Number(this.route.snapshot.paramMap.get('id'));
  }

  getTaskPromise(): Promise<Task | undefined> {
    if (this.taskPromise == undefined) {
      this.taskPromise = this.taskHandlerService.get(this._id);
    }
    return this.taskPromise;
  }
}
