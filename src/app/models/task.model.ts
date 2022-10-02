import {dateToJsonTimeString, jsonTimeStringToDate, ProgressState} from '../utilities'
import {
  default_priority,
  default_progress_state,
  default_time_estimate_sec,
  get_default_due_date, TASK_IS_ROOT_TASK_ID,
} from '../constants'

export class Task {
  static INVALID_TASK = new Task("", "", ProgressState.not_started, -1);

  constructor(
    public name: string,
    public description: string,
    public progressState: ProgressState = default_progress_state,
    private _id: number | undefined = undefined,
    public dueDate: Date = get_default_due_date(),
    public timeEstimateSec: number = default_time_estimate_sec,
    public priority: number = default_priority,
    public parentTaskID: number = TASK_IS_ROOT_TASK_ID,
    public subtasks: Task[] = [],
    public isDisplayed: boolean = false,
  ) {
  }

  get isFinished(): boolean {
    return this.progressState == ProgressState.is_finished;
  }

  get inProgress(): boolean {
    return this.progressState == ProgressState.in_progress;
  }

  get notStated(): boolean {
    return this.progressState == ProgressState.not_started;
  }

  get id(): number {
    return <number>this._id;
  }

  get progressStateAsNumber(): number {
    return Number(this.progressState);
  }

  changeIsDisplayed() {
    this.isDisplayed = !this.isDisplayed;
  }

  isInvalid(): boolean {
    return this.isEqual(Task.INVALID_TASK);
  }

  isEqual(task: Task): boolean {
    //check whether all attributes are Equal
    return task.name == this.name
      && task.description == this.description && task.progressState == this.progressState
      && task.id == this._id && task.dueDate == this.dueDate
      && task.timeEstimateSec == this.timeEstimateSec &&
      task.priority == this.priority && task.parentTaskID == this.parentTaskID;
  }

  removeSubtask(subtask: Task) {
    this.subtasks = this.subtasks.filter(value => value.id != subtask.id);
  }

  static serialize_list(tasks: Task[]): { [k: string]: any }[] {
    let tasks_json: { [k: string]: any }[] = [];
    tasks.forEach((task: Task) => tasks_json.push(Task.serialize(task)));
    return tasks_json;
  }

  static serialize(task: Task): { [k: string]: any } {
    return {
      "name": task.name,
      "description": task.description,
      "due_date": dateToJsonTimeString(task.dueDate),
      "progress_state": task.progressStateAsNumber,
      "priority": task.priority,
      "time_estimate_sec": task.timeEstimateSec,
      "root_task_id": task.parentTaskID
    };
  }

  static deserializeList(json: { [k: string]: any }[]): Task[] {
    let tasks: Task[] = [];
    json.forEach((task_json: { [k: string]: any }) => {
      let task: Task | undefined = Task.deserialize(task_json);
      if (task != undefined) {
        tasks.push(task);
      }
    });
    return tasks;
  }

  static deserialize(json: { [k: string]: any }): Task {
    let task: Task = Task.INVALID_TASK;
    if (json["name"] != undefined && json["description"] != undefined && json["due_date"] != undefined &&
      json["progress_state"] != undefined && json["priority"] != undefined &&
      json["time_estimate_sec"] != undefined && json["id"] != undefined && json["root_task_id"] != undefined) {
      task = new Task(json["name"], json["description"], json["progress_state"], json["id"],
        jsonTimeStringToDate(json["due_date"]), json["time_estimate_sec"], json["priority"], json["root_task_id"])
    } else {
      console.log("Error creating Task form JSON");
    }
    return task;
  }

  static copyTask(task: Task, omitID: boolean = false): Task {
    return new Task(task.name, task.description, task.progressState, omitID ? undefined : task.id,
      task.dueDate, task.timeEstimateSec, task.priority, task.parentTaskID, task.subtasks);
  }

  static emptyTask(): Task {
    return new Task("", "");
  }
}
