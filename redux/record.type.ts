//state type
export interface RecordState {
    recordListState: [] | null;
    exampleStringState: string | null;
    refreshNumberState : number | null;
    tabViewState : object | null;
    recordUsedCntState : number | null;
}

//action key type
export const SET_RECORD_LIST = 'SET_RECORD_LIST';
export const SET_EXAMPLE_STRING = 'SET_EXAMPLE_STRING';
export const SET_REFRESH_NUMBER = 'SET_REFRESH_NUMBER';
export const SET_TABVIEW = 'SET_TABVIEW';
export const SET_RECORD_USED_CNT = 'SET_RECORD_USED_CNT';

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

export interface SetTabViewAction {
    type: typeof SET_TABVIEW;
    tabViewState: object | null;
}

export interface SetRecordUsedCntAction {
    type : typeof SET_RECORD_USED_CNT;
    recordUsedCntState: number | null;

}