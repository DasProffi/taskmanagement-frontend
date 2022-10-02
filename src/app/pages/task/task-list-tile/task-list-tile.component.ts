import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../../models/task.model";
import {ProgressState} from "../../../utilities";
import {Router} from "@angular/router";
import {TASK_MAX_SUBTASKS} from "../../../constants";
import {TaskHandlerService} from "../../../services/task-handler.service";
import {DialogTaskDeleteComponent} from "../dialog-task-delete/dialog-task-delete.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-task-list-tile',
  templateUrl: './task-list-tile.component.html',
  styleUrls: ['./task-list-tile.component.css']
})
export class TaskListTileComponent implements OnInit {

  constructor(private taskHandlerService: TaskHandlerService, private router: Router, public dialog: MatDialog) {
  }

  @Input() task!: Task;
  @Input() depth!: number;
  TASK_MAX_SUBTASKS = TASK_MAX_SUBTASKS;
  ProgressState = ProgressState;

  ngOnInit(): void {
  }

  updateProgressState(progressState: ProgressState) {
    this.task.progressState = progressState;
    this.taskHandlerService.update(this.task).then((hasSuccess: boolean) => {
      if (!hasSuccess) {
        console.log("error at update");
        let oldTask: Task = this.taskHandlerService.getTaskByID(this.task.id);
        this.task.progressState = oldTask.progressState;
      }
    })
  }

  createSubtask() {
    this.router.navigate([`/task/create/p/${this.task.id}`]).then();
  }

  update() {
    this.router.navigate([`/task/update/${this.task.id}`]).then();
  }

  delete() {
    const dialogRef = this.dialog.open(DialogTaskDeleteComponent, {data: {task: this.task}});
    dialogRef.afterClosed().subscribe((deleteOptions: { [k: string]: any }) => {
        if (deleteOptions["delete"]) {
          this.taskHandlerService.delete(this.task, deleteOptions["deleteAllSubtasks"]).then();
        }
      },
    );
  }

  changeDisplaySubtasks() {
    this.task.changeIsDisplayed();
  }
}
