import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../../models/task.model";

@Component({
  selector: 'app-dialog-task-delete',
  templateUrl: './dialog-task-delete.component.html',
  styleUrls: ['./dialog-task-delete.component.css']
})
export class DialogTaskDeleteComponent {
  task: Task = Task.emptyTask();
  deleteAllSubtasks: boolean = true;

  constructor(public dialogRef: MatDialogRef<DialogTaskDeleteComponent>, @Inject(MAT_DIALOG_DATA) public data: { task: Task }) {
    this.task = data["task"];
  }

  onAbortClick() {
    this.dialogRef.close({"delete": false})
  }

  onDeleteClick() {
    this.dialogRef.close({"delete": true, "deleteAllSubtasks": this.deleteAllSubtasks})
  }
}
