import {Injectable} from "@angular/core";
import {TasksApiService} from "./tasks-api.service";
import {Task} from "../models/task.model";
import {TASK_IS_ROOT_TASK_ID, TASK_MAX_SUBTASKS,} from "../constants";
import {logDebug, logInfo} from "../utilities";

@Injectable()
export class TaskHandlerService {
  static rootTasks: Task[] = [];

  constructor(private tasksApiService: TasksApiService) {
  }

  get rootTasks(): Task[] {
    return TaskHandlerService.rootTasks;
  }

  set rootTasks(tasks: Task[]) {
    TaskHandlerService.rootTasks = tasks;
  }

  // return value wasSuccessful, when fetching caused no errors
  async fetchRootTasks(isLoadingSubtasks: boolean = true): Promise<boolean> {
    let wasSuccessful: boolean = true;
    await this.tasksApiService.fetchRootTasks().then(
      value => this.rootTasks = value,
      _ => wasSuccessful = false
    )
    if (isLoadingSubtasks) {
      this.rootTasks.forEach(value => this.loadAndSetSubtasks(value, 0))
    }
    return wasSuccessful;
  }

  async getAllTasks(): Promise<Task[]> {
    let tasks: Task[] = [];
    await this.tasksApiService.getAllTasks().then(value => tasks = value);
    return tasks;
  }

  isRootTask(taskID: number): boolean {
    return this.rootTasks.findIndex(value => value.id == taskID) != -1;
  }

  getTaskByID(taskID: number, currentDepth: number = 0, currentTaskList: Task[] = this.rootTasks,
              maxDepth = TASK_MAX_SUBTASKS): Task {
    let task = Task.INVALID_TASK;
    if (currentDepth >= maxDepth || currentTaskList.length <= 0) {
      return task;
    }
    for (let i: number = 0; i < currentTaskList.length && task.isInvalid(); i++) {
      if (currentTaskList[i].id == taskID) {
        task = currentTaskList[i];
        break;
      } else {
        task = this.getTaskByID(taskID, currentDepth + 1, currentTaskList[i].subtasks, maxDepth);
      }
    }
    return task;
  }

  private removeInTree(task: Task) {
    if (this.isRootTask(task.id)) {
      this.rootTasks = this.rootTasks.filter((obj: Task) => obj.id != task.id);
    } else {
      let rootTask: Task = this.getTaskByID(task.parentTaskID);
      rootTask.removeSubtask(task);
    }
  }

  private addInTree(task: Task) {
    if (task.parentTaskID == TASK_IS_ROOT_TASK_ID) {
      this.rootTasks.push(task);
    } else {
      let parentTask: Task = this.getTaskByID(task.parentTaskID);
      parentTask.subtasks.push(task);
    }
  }

  private replaceInTree(newTask: Task) {
    let oldTask: Task = this.getTaskByID(newTask.id);
    if (oldTask.isInvalid()) {
      logInfo("Data not consistent, please reload");
    }
    newTask.subtasks = oldTask.subtasks;
    if (newTask.parentTaskID != oldTask.parentTaskID) {
      this.removeInTree(oldTask); // Deleting old Task
      this.addInTree(newTask); // adding New Task
    } else if (newTask.parentTaskID == TASK_IS_ROOT_TASK_ID) {
      let index: number = this.rootTasks.findIndex(value => value.id == newTask.id);
      this.rootTasks[index] = newTask;
    } else {
      let newParent: Task = this.getTaskByID(newTask.parentTaskID);
      let index: number = newParent.subtasks.findIndex(value => value.id == newTask.id);
      newParent.subtasks[index] = newTask;
    }
  }

  async toRootTask(tasks: Task[], parentToDelete: Task = Task.INVALID_TASK) {
    for (let i: number = 0; i < tasks.length; i++) {
      let task: Task = Task.copyTask(tasks[i]);
      task.parentTaskID = TASK_IS_ROOT_TASK_ID;
      logDebug(this.rootTasks);
      await this.update(task).then();
    }
    if (!parentToDelete.isInvalid()) {
      //this.removeInTree(parentToDelete);
    }
  }

  async add(task: Task):
    Promise<boolean> {
    return this.create(task);
  }

  async get(task_id: number):
    Promise<Task | undefined> {
    return this.read(task_id);
  }

  async deleteByListIndex(index: number):
    Promise<boolean> {
    if (index < 0 && this.rootTasks.length > index
    )
      return false;

    let task: Task = this.rootTasks[index];
    return this.delete(task);
  }

  async loadAndSetSubtasks(parentTask: Task, depth: number) {
    if (depth < TASK_MAX_SUBTASKS) {
      await this.tasksApiService.getSubtasks(parentTask).then(value => {
        parentTask.subtasks = value;
        parentTask.subtasks.forEach(value1 => this.loadAndSetSubtasks(value1, depth + 1));
      });
    }
  }

  async create(task: Task): Promise<boolean> {
    let isOK = true;
    await this.tasksApiService.create(task).then(taskNew => {
        this.addInTree(taskNew);
      },
      _ => isOK = false
    );
    return isOK;
  }

  async read(taskID: number): Promise<Task> {
    let task: Task = Task.INVALID_TASK;
    await this.tasksApiService.read(taskID).then(value => task = value);
    return task;
  }

  async update(task: Task): Promise<boolean> {
    let isOK: boolean = true;
    await this.tasksApiService.update(task).then(
      taskNew => {
        this.replaceInTree(taskNew);
      },
      _ => isOK = false,
    );
    return isOK;
  }

  async delete(task: Task, deleteChildren: boolean = false): Promise<boolean> {
    let isOK: boolean = true;
    await this.tasksApiService.delete(task).then(
      value => isOK = value,
      _ => isOK = false,
    );
    if (isOK) {
      if (deleteChildren) {
        task.subtasks.forEach(value => this.delete(value, deleteChildren))
      } else {
        await this.toRootTask(task.subtasks, task);
      }
      this.removeInTree(task);
    }
    return isOK;
  }
}
