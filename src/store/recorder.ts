import { Action } from "redux";
import { RootState } from "./index";

interface RecorderState {
  dateStart: string;
}

const START = "recorder/start";
const STOP = "recorder/stop";

type StartAction = Action<typeof START>;
type StopAction = Action<typeof STOP>;

const initialState: RecorderState = {
  dateStart: "",
};

export const start = () => ({
  type: START,
});
export const stop = () => ({
  type: STOP,
});
export const selectRecorder = (rootState: RootState) => rootState.recorder;
export const selectDateStart = (rootState: RootState) =>
  selectRecorder(rootState).dateStart;
const recorderReducer = (
  state: RecorderState = initialState,
  action: StartAction | StopAction
): RecorderState => {
  switch (action.type) {
    case START:
      return { ...state, dateStart: new Date().toISOString() };
    case STOP:
      return { ...state, dateStart: "" };
    default:
      return state;
  }
};

export default recorderReducer;
