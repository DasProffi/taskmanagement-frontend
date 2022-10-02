import {ProgressState} from "./utilities";

// Task defaults
export const default_progress_state = ProgressState.not_started;
export function get_default_due_date(): Date {
  return new Date(Date.now() + 1000 * 3600 * 24 * 7);
}
export const default_time_estimate_sec = 3600;
export const default_priority = 5;

// Task requirements
export const TASK_IS_ROOT_TASK_ID = -1;
export const TASK_NAME_MAX_LENGTH = 64;
export const TASK_DESCRIPTION_MAX_LENGTH = 2048;
export const TASK_MAX_SUBTASKS = 5;
export const TASK_MIN_PRIORITY = 0;
export const TASK_MAX_PRIORITY = 9;
export const TASK_MAX_LENGTH_PRIORITY_INPUT = 1;


// ProgressState constants
export const progress_state_min = 1;
export const progress_state_max = 3;
