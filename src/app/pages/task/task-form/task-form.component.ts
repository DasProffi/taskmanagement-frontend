import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../../models/task.model";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {dateToString, progress_state_label_mapping, ProgressState} from "../../../utilities";
import {TASK_DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH, TASK_MIN_PRIORITY, TASK_MAX_PRIORITY, TASK_MAX_LENGTH_PRIORITY_INPUT} from "../../../constants";
import {TaskHandlerService} from "../../../services/task-handler.service";

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup = new FormGroup({
    "name": new FormControl(),
    "description": new FormControl(),
    "progress_state_raw": new FormControl(),
    "due_dateString": new FormControl(),
    "time_estimate_sec": new FormControl(),
    "priority": new FormControl(),
    "root_task_id": new FormControl(),
  });
  @Input()task: Task = Task.emptyTask();
  @Input() taskPromise: Promise<Task | undefined> | undefined;
  // accepted Inputs "update", "add", default: "none"
  @Input() formType: string = "none";
  @Input() isResetEnabled: boolean = false;
  @Input() submitButtonText: string = "Add Task";
  @Input() resetButtonText: string = "Reset";
  @Input() titleText: string = "Create a new Task";
  newTask: Task = Task.emptyTask();
  isSubmitRequestOK: boolean = true;
  TASK_NAME_MAX_LENGTH = TASK_NAME_MAX_LENGTH;
  TASK_DESCRIPTION_MAX_LENGTH = TASK_DESCRIPTION_MAX_LENGTH;
  TASK_MIN_PRIORITY = TASK_MIN_PRIORITY;
  TASK_MAX_PRIORITY = TASK_MAX_PRIORITY;
  TASK_MAX_LENGTH_PRIORITY_INPUT = TASK_MAX_LENGTH_PRIORITY_INPUT;
  progressStates: ProgressState[] = Object.values(ProgressState).filter(value => typeof value === 'number') as ProgressState[];
  progressStatesLabelMapping: Record<ProgressState, string> = progress_state_label_mapping;
  dueDateString: string = "";


  constructor(private router: Router, private taskHandlerService: TaskHandlerService) {
  }

  ngOnInit(): void {
    let errorFunction: (() => void) = () => {
      window.alert("An error occurred while loading the Data");
      this.router.navigate(["/task/view"]).then();
    };
    if (this.taskPromise != undefined) {
      this.taskPromise.then(
        value => {
          if (value != undefined) {
            this.task = value;
            this.dueDateString = dateToString(value.dueDate);
            this._loadInputTask();
          } else {
            errorFunction();
          }
        },
        _ => errorFunction(),
      )
    }
    this.dueDateString = dateToString(this.task.dueDate);
    this._loadInputTask();
    this.loadTasks().then();
  }

  async loadTasks() {
    await this.taskHandlerService.fetchRootTasks().then();
  }

  submit() {
    switch (this.formType) {
      case "add":
        this._addSubmitFunction(this.taskForm);
        break;
      case "update":
        this._updateSubmitFunction(this.taskForm);
        break;
      default:
        this.router.navigate(['/task/view']).then();
    }
  }

  reset() {
    this._loadInputTask();
  }

  cancel() {
    this.router.navigate(["/task/home"]).then();
  }

  private _addSubmitFunction(_: FormGroup) {
    const _this = this;
    let task = this._validateAndCreateTask();
    if (task.isInvalid()) {
      return;
    }
    this.taskHandlerService.add(task).then(is_added => {
      if (is_added) {
        _this.router.navigate(['/task/view']).then();
      } else {
        _this.isSubmitRequestOK = false;
      }
    }, _ => _this.isSubmitRequestOK = false);
  }

  private _updateSubmitFunction(_: FormGroup) {
    const _this = this;
    let task = this._validateAndCreateTask();
    if (task.isInvalid()) {
      return;
    }
    this.taskHandlerService.update(task).then(is_added => {
        if (is_added) {
          _this.router.navigate(['/task/view']).then();
        } else {
          _this.isSubmitRequestOK = false;
        }
      },
      _ => _this.isSubmitRequestOK = false);
  }

  // fills the form with the input Task data
  private _loadInputTask() {
    this.newTask = Task.copyTask(this.task);
    this.taskForm.patchValue({
      "name": this.newTask.name,
      "description": this.newTask.description,
      "progress_state_raw": this.newTask.progressState,
      "due_dateString": dateToString(this.newTask.dueDate),
      "time_estimate_sec": this.newTask.timeEstimateSec,
      "priority": this.newTask.priority,
      "root_task_id": this.newTask.parentTaskID,
    });
  }

  // validates and create a new Task based on the data given
  private _validateAndCreateTask(): Task {
    if (!this.taskForm.valid) {
      return Task.INVALID_TASK;
    }
    let controls = this.taskForm.controls;

    if (!this.isRootTaskValid()) {
      this.taskForm.patchValue({"root_task_id": this.newTask.parentTaskID,})
      return Task.INVALID_TASK;
    }

    return new Task(controls['name'].value, controls['description'].value,
      Number(controls['progress_state_raw'].value), this.newTask.id,
      new Date(Date.parse(controls["due_dateString"].value)), controls['time_estimate_sec'].value,
      controls["priority"].value, controls["root_task_id"].value);
  }

  isRootTaskValid(): boolean {
    let rootTaskID: number = this.taskForm.controls["root_task_id"].value;
    let id = this.newTask.id;
    let idEqual = true;
    if (id == undefined || id != rootTaskID) {
      idEqual = false;
    }
    return (!this.taskHandlerService.getTaskByID(rootTaskID).isInvalid() || rootTaskID == -1) && !idEqual;
  }
}
