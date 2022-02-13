//state type
export interface RecordState {
    recordListState: [] | null;
    exampleStringState: string | null;
    refreshNumberState : number | null;
}

//action key type
export const SET_RECORD_LIST = 'SET_RECORD_LIST';
export const SET_EXAMPLE_STRING = 'SET_EXAMPLE_STRING';
export const SET_REFRESH_NUMBER = 'SET_REFRESH_NUMBER';

//action type
export interface SetRecordListAction {
    type: typeof SET_RECORD_LIST;
    recordListState: [] | null;
}

export interface SetExampleStringAction {
    type: typeof SET_EXAMPLE_STRING;
    exampleStringState: string | null;
}

export interface SetReFreshNumberAction {
    type: typeof SET_REFRESH_NUMBER;
    refreshNumberState: number | null;
}