import {
    RecordState,
    SET_RECORD_LIST,
    SET_EXAMPLE_STRING,
    SetExampleStringAction,
    SetRecordListAction,
    SetReFreshNumberAction,
    SET_REFRESH_NUMBER,
} from './record.type'

//first example state
export const recordState: RecordState = {
    exampleStringState: "",
    recordListState: null,
    refreshNumberState: 100,
};


//action
export const setRecordList = (list: []): SetRecordListAction => {
    return {
        type: SET_RECORD_LIST,
        recordListState: list,
    };
};

export const setExampleString = (text: string): SetExampleStringAction => {
    return {
        type: SET_EXAMPLE_STRING,
        exampleStringState: text,
    };
};

export const setRefreshNumber = (num: number): SetReFreshNumberAction => {
    return {
        type: SET_REFRESH_NUMBER,
        refreshNumberState: num,
    }
}


//reducer
export const recordReducer = (state = recordState, action): RecordState => {
    switch (action.type) {
        case SET_RECORD_LIST:
            return { ...state, recordListState: action.recordListState };
        case SET_EXAMPLE_STRING:
            return { ...state, exampleStringState: action.exampleStringState };
        case SET_REFRESH_NUMBER:
            return { ...state, refreshNumberState: action.refreshNumberState };

        default:
            return state;
    }
}