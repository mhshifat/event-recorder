import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./index";
import { selectDateStart } from "./recorder";

export interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

interface UserEventsState {
  byIds: Record<UserEvent["id"], UserEvent>;
  allIds: UserEvent["id"][];
}

const LOAD_REQUEST = "userEvents/load_request";
const LOAD_SUCCESS = "userEvents/load_success";
const LOAD_FAILURE = "userEvents/load_failure";
interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}
interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}
interface LoadFailureAction extends Action<typeof LOAD_FAILURE> {
  error: string;
}

const CREATE_REQUEST = "userEvents/create_request";
const CREATE_SUCCESS = "userEvents/create_success";
const CREATE_FAILURE = "userEvents/create_failure";
interface CreateRequestAction extends Action<typeof CREATE_REQUEST> {}
interface CreateSuccessAction extends Action<typeof CREATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}
interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {
  error: string;
}

const UPDATE_REQUEST = "userEvents/update_request";
const UPDATE_SUCCESS = "userEvents/update_success";
const UPDATE_FAILURE = "userEvents/update_failure";
interface UpdateRequestAction extends Action<typeof UPDATE_REQUEST> {}
interface UpdateSuccessAction extends Action<typeof UPDATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}
interface UpdateFailureAction extends Action<typeof UPDATE_FAILURE> {
  error: string;
}

const DELETE_REQUEST = "userEvents/delete_request";
const DELETE_SUCCESS = "userEvents/delete_success";
const DELETE_FAILURE = "userEvents/delete_failure";
interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> {}
interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
  payload: {
    eventId: UserEvent["id"];
  };
}
interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {
  error: string;
}

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
};

export const selectUserEventsState = (rootState: RootState) =>
  rootState.userEvents;
export const selectUserEventsArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map((id) => state.byIds[id]);
};
export const loadUserEvents = (): ThunkAction<
  void,
  RootState,
  undefined,
  LoadRequestAction | LoadSuccessAction | LoadFailureAction
> => async (dispatch, getState) => {
  dispatch({ type: LOAD_REQUEST });

  try {
    const events: UserEvent[] =
      JSON.parse(localStorage.getItem("events") || "") || [];

    dispatch({ type: LOAD_SUCCESS, payload: { events } });
  } catch (err) {
    dispatch({ type: LOAD_FAILURE, error: "Failed to load events." });
  }
};
export const createUserEvent = (): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  CreateRequestAction | CreateSuccessAction | CreateFailureAction
> => async (dispatch, getState) => {
  dispatch({ type: CREATE_REQUEST });

  try {
    const eventStartDate = selectDateStart(getState());
    const events: UserEvent[] =
      JSON.parse(localStorage.getItem("events") || "") || [];
    const newEvent: UserEvent = {
      id: events.length + 1,
      title: "No title",
      dateStart: eventStartDate,
      dateEnd: new Date().toISOString(),
    };
    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    dispatch({ type: CREATE_SUCCESS, payload: { event: newEvent } });
  } catch (err) {
    dispatch({ type: CREATE_FAILURE, error: "Failed to create event." });
  }
};
export const updateUserEvent = (
  updatedEvent: UserEvent
): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction
> => async (dispatch, getState) => {
  dispatch({ type: UPDATE_REQUEST });

  try {
    const events: UserEvent[] =
      JSON.parse(localStorage.getItem("events") || "") || [];
    localStorage.setItem(
      "events",
      JSON.stringify(
        events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      )
    );

    dispatch({ type: UPDATE_SUCCESS, payload: { event: updatedEvent } });
  } catch (err) {
    dispatch({ type: UPDATE_FAILURE, error: "Failed to update event." });
  }
};
export const deleteUserEvent = (
  id: UserEvent["id"]
): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction
> => async (dispatch, getState) => {
  dispatch({ type: DELETE_REQUEST });

  try {
    const events: UserEvent[] =
      JSON.parse(localStorage.getItem("events") || "") || [];
    localStorage.setItem(
      "events",
      JSON.stringify(events.filter((event) => event.id !== id))
    );
    dispatch({ type: DELETE_SUCCESS, payload: { eventId: id } });
  } catch (err) {
    dispatch({ type: DELETE_FAILURE, error: "Failed to delete event." });
  }
};

const userEventsReducer = (
  state: UserEventsState = initialState,
  action:
    | LoadRequestAction
    | LoadSuccessAction
    | LoadFailureAction
    | CreateRequestAction
    | CreateSuccessAction
    | CreateFailureAction
    | DeleteRequestAction
    | DeleteSuccessAction
    | DeleteFailureAction
    | UpdateRequestAction
    | UpdateSuccessAction
    | UpdateFailureAction
): UserEventsState => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;
      return {
        ...state,
        allIds: events.map((event) => event.id),
        byIds: events.reduce<UserEventsState["byIds"]>((byIds, event) => {
          byIds[event.id] = event;
          return byIds;
        }, {}),
      };
    case CREATE_SUCCESS:
      const { event } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, event.id],
        byIds: { ...state.byIds, [event.id]: event },
      };
    case UPDATE_SUCCESS:
      const { event: updatedEvent } = action.payload;
      const newUpdatedState = { ...state };
      newUpdatedState.byIds[updatedEvent.id] = updatedEvent;
      return newUpdatedState;
    case DELETE_SUCCESS:
      const { eventId } = action.payload;
      const newState: UserEventsState = {
        allIds: state.allIds.filter((id) => id !== eventId),
        byIds: { ...state.byIds },
      };
      delete newState.byIds[eventId];
      return newState;
    default:
      return state;
  }
};

export default userEventsReducer;
