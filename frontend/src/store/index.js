import {configureStore} from '@reduxjs/toolkit';
//import authReducer from './auth';
import authReducer from 'store/auth';
const store = configureStore({
    reducer: {
        auth: authReducer,
        
    }
});
export default store;