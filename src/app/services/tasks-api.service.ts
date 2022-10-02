import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Task} from '../models/task.model';
import {httpExecute, logDebug} from "../utilities";

@Injectable()
export class TasksApiService {
  constructor(private http: HttpClient) {
  }

  private static async taskValidityCheck(task: Task): Promise<Task> {
    if (task.isInvalid()) {
      return Promise.reject("TaskHandler Task Invalid");
    }
    return task;
  }

  async fetchRootTasks(): Promise<Task[]> {
    let tasks: Task[] = [];
    await firstValueFrom(httpExecute<{ [k: string]: any }[]>(this.http, "get", "/api/roottasks")).then(
      value => tasks = Task.deserializeList(value),
      reason => logDebug(reason),
    );
    return tasks;
  }

  // fetch list of tasks from server api
  async getAllTasks(): Promise<Task[]> {
    let tasks: Task[] = [];
    await firstValueFrom(httpExecute<{ [k: string]: any }[]>(this.http, "get", "/api/tasks")).then(
      value => tasks = Task.deserializeList(value),
      reason => logDebug(reason),
    );
    return tasks;
  }

  async getSubtasks(task: Task): Promise<Task[]> {
    let tasks: Task[] = [];
    await firstValueFrom(httpExecute<{ [k: string]: any }[]>(this.http, "get", `/api/subtasks/${task.id}`)).then(
      value => tasks = Task.deserializeList(value),
      reason => logDebug(reason),
    );
    return tasks;
  }

  async create(task: Task): Promise<Task> {
    let taskNew: Task = Task.INVALID_TASK;
    taskNew.progressState = Number(taskNew.progressState);
    await firstValueFrom(httpExecute<{ [k: string]: any }>(this.http, "post", "/api/task", Task.serialize(task))).then(
      value => {
        taskNew = Task.deserialize(value);
      },
      reason => logDebug(reason),
    );
    return TasksApiService.taskValidityCheck(taskNew);
  }

  async read(taskID: number): Promise<Task> {
    let task: Task = Task.INVALID_TASK;
    await firstValueFrom(httpExecute<{ [k: string]: any }>(this.http, "get", `/api/task/${taskID}`)).then(
      value => {
        task = Task.deserialize(value);
      },
      reason => console.log(reason),
    );
    return TasksApiService.taskValidityCheck(task);
  }

  async update(task: Task): Promise<Task> {
    let taskNew: Task = Task.INVALID_TASK;
    await firstValueFrom(httpExecute<{ [k: string]: any }>(this.http, "put", `/api/task/${task.id}`, Task.serialize(task))).then(
      value => {
        taskNew = Task.deserialize(value);
      },
      reason => {
        console.log(reason);
      }
    );
    return TasksApiService.taskValidityCheck(taskNew);
  }

  async delete(task: Task): Promise<boolean> {
    let is_ok: boolean = true;
    await firstValueFrom(httpExecute<{ [k: string]: any }>(this.http, "delete", `/api/task/${task.id}`)).then(
      data => {
        if (data['success'] == undefined || !data['success']) {
          is_ok = false;
        }
      },
      reason => {
        console.log(reason);
        is_ok = false;
      }
    )
    return is_ok;
  }
}
