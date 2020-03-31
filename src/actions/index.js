import axios from 'axios';
import { reset } from 'redux-form';
import {
    AUTH_USER,
    UNAUTH_USER,

    FETCH_PROFILE,
    CLEAR_PROFILE,
    UPDATE_PROFILE,

    FETCH_POSTS,
    CLEAR_POST,
    FETCH_POST,
    UPDATE_POST,
    DELETE_POST,

    CHECK_AUTHORITY,

    CREATE_COMMENT,
    FETCH_COMMENTS,
} from './types';

const ROOT_URL = '/api';