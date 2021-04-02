import { combineReducers } from '@reduxjs/toolkit';
import domainReducer from './domainSlice';

const reducers = combineReducers({
    domains: domainReducer,
})

export default reducers