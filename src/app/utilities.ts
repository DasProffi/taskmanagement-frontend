// changes here affect constants.ts
import {Observable} from "rxjs";
import {API_URL, debug} from "./config";
import {HttpClient, HttpHeaders} from "@angular/common/http";

export enum ProgressState {
  not_started = 1,
  in_progress = 2,
  is_finished = 3,
}

export const progress_state_label_mapping: Record<ProgressState, string> = {
  [ProgressState.not_started]: "Not Started",
  [ProgressState.in_progress]: "In Progress",
  [ProgressState.is_finished]: "Is finished",
}

export function dateToString(date: Date): string {
  let today: Date = new Date(date);
  let d: string = ("" + today.getDate()).padStart(2, "0");
  let m: string = ("" + (today.getMonth() + 1)).padStart(2, "0"); //January is 0!
  let y: string = "" + today.getFullYear();

  return y + '-' + m + '-' + d;
}

export function httpExecute<T>(httpClient: HttpClient, method: string,
                               resource: string, body: {[k :string] : any } = {}, header: {[k :string] : string}={}): Observable<T> {
  const currentURL = `${API_URL}${resource}`;
  let httpHeader:HttpHeaders=new HttpHeaders(header);

  const httpOptions = {headers:httpHeader};

  switch (method) {
    case 'delete':
      return httpClient.delete<T>(currentURL, httpOptions,);
    case 'get':
      return httpClient.get<T>(currentURL, httpOptions)
    case 'post':
      return httpClient.post<T>(currentURL, body, httpOptions)
    case 'put':
      return httpClient.put<T>(currentURL, body, httpOptions);
    default:
      return new Observable(subscriber => subscriber.error("Api: Wrong Method used"));
  }
}

export function jsonTimeStringToDate(json_string: string) : Date {
  return new Date(Date.parse(json_string));
}

export function dateToJsonTimeString(date: Date) : string{
  let year = (date.getFullYear() + "").padStart(4, "0")
  let month = ((date.getMonth()+1) + "").padStart(2, "0")
  let day = (date.getDate() + "").padStart(2, "0")
  let hours = (date.getHours() + "").padStart(2, "0")
  let minutes = (date.getMinutes() + "").padStart(2, "0")
  let seconds = (date.getSeconds() + "").padStart(2, "0")
  return year + "-" + month + "-" + day + " " + hours + ":" +  minutes + ":" + seconds;
}


// logging
export function logDebug(data:any){
  if(debug){
    console.log(data);
  }
}

export function logInfo(data:any){
  console.log(data);
}
