import {Component} from '@angular/core';
import {Task} from "../../../models/task.model";
import {Router} from "@angular/router";
import {TaskHandlerService} from "../../../services/task-handler.service";
import {logDebug, logInfo} from "../../../utilities";
import {debug} from "../../../config";
import {DialogTaskDeleteComponent} from "../dialog-task-delete/dialog-task-delete.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})

export class TaskViewComponent {
  Task = Task;
  title = 'Tasks';
  debug = debug

  constructor(private taskHandlerService: TaskHandlerService, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.taskHandlerService.fetchRootTasks().then();
  }

  getTasks(): Task[] {
    return this.taskHandlerService.rootTasks;
  }

  newEntreClick() {
    this.router.navigate(['/task/create']).then();
  }

  deleteLastEntreClick() {
    const last = this.taskHandlerService.rootTasks.length - 1;
    this.taskHandlerService.deleteByListIndex(last).then();
  }

  updateFirstClick() {
    const first = this.taskHandlerService.rootTasks[0];
    first.name = "Update implemented7";
    first.description = "This is a description2";
    this.taskHandlerService.update(first).then();
  }

  logAllTasks() {
    this.taskHandlerService.getAllTasks().then(value => logDebug(value));
  }

  logRootTasks() {
    logInfo(this.taskHandlerService.rootTasks);
  }

  deleteAll() {
    const dialogRef = this.dialog.open(DialogTaskDeleteComponent, {data: {task: Task.emptyTask()}});
    dialogRef.afterClosed().subscribe((deleteOptions: { [k: string]: any }) => {
        if (deleteOptions["delete"]) {
          this.taskHandlerService.getAllTasks().then(value => value.forEach(value1 => this.taskHandlerService.delete(value1)));
        }
      },
    );
  }
}
