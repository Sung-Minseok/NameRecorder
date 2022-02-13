import {combineReducers, createStore, Reducer, Store} from 'redux';

//reducers
import { recordReducer } from './record';

const rootReducer: Reducer = combineReducers({
    record: recordReducer,
});

const store: Store = createStore(rootReducer);

export default store;