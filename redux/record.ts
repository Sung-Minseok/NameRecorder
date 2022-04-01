import {
    RecordState,
    SET_RECORD_LIST,
    SET_EXAMPLE_STRING,
    SetExampleStringAction,
    SetRecordListAction,
    SetReFreshNumberAction,
    SET_REFRESH_NUMBER,
    SetTabViewAction,
    SET_TABVIEW,
    SET_RECORD_USED_CNT,
    SetRecordUsedCntAction,
    SET_CURRENTUSER,
    SetCurrentUserAction,
    SET_RECORD_NUM,
    SetRecordNumAction,
    SET_CAMERA_LOAD,
    SetCameraLoadAction,
    SET_PHOTO_LIST,
    SetPhotoListAction,
} from './record.type'



//first example state
export const recordState: RecordState = {
    exampleStringState: "",
    recordListState: null,
    refreshNumberState: 100,
    tabViewState: null,
    recordUsedCntState: 0,
    recordNumState: 10,
    currentUserState: "비회원",
    cameraLoadState: false,
    photoListState: [],
    
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

export const setTabView = (tabview: object): SetTabViewAction => {
    return {
        type: SET_TABVIEW,
        tabViewState: Object,
    }
}

export const setRecordUsedCnt = (num: number): SetRecordUsedCntAction => {
    return {
        type: SET_RECORD_USED_CNT,
        recordUsedCntState: num,
    }
}

export const setCurrentUser = (user: string): SetCurrentUserAction => {
    return {
        type: SET_CURRENTUSER,
        currentUserState: user,
    }
}

export const setRecordNum = (num: number): SetRecordNumAction => {
    return{
        type: SET_RECORD_NUM,
        recordNumState: num,
    }
}

export const setCameraLoad = (state: boolean): SetCameraLoadAction => {
    return{
        type: SET_CAMERA_LOAD,
        cameraLoadState: state,
    }
}

export const setPhotoList = (state: []): SetPhotoListAction => {
    return{
        type: SET_PHOTO_LIST,
        photoListState: state
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
        case SET_TABVIEW:
            return { ...state, tabViewState: action.tabViewState };
        case SET_RECORD_USED_CNT:
            return { ...state, recordUsedCntState: action.recordUsedCntState };
        case SET_RECORD_NUM:
            return { ...state, recordNumState: action.recordNumState };
        case SET_CURRENTUSER:
            return { ...state, currentUserState: action.currentUserState };
        case SET_CAMERA_LOAD:
            return { ...state, cameraLoadState: action.cameraLoadState };
        case SET_PHOTO_LIST:
            return { ...state, photoListState: action.photoListState };
        default:
            return state;
    }
}