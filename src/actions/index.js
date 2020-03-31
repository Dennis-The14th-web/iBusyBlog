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
    CREATE_POST,
} from './types';
import { func } from 'prop-types';

const ROOT_URL = '/api';

// Authentication

export function signinUser ({email, password}, historyPush, historyReplace) {

    // Using redux-thunk to return function instead of returning an object
    // Redux-thunk is giving acces to dispatch function, and also allows us to dispatch our actions at any giving time 

    return function (dispatch){

        // Submit email/password to server
        axios.post(`${ROOT_URL}/signin`, { email, password })
        .then(response => {
            localStorage.setIthem('token', response.data.token);
            dispatch({
                type:AUTH_USER,
                payload: response.data.username,
            });
             historypush('/posts');
        })
        .catch(() => {
            historyReplace('/signin', {
                time: new Date().toLocaleString(),
                message: 'The email and / or password are incorrect.'
            });
        });
    }

}

export function signupUser({email, password, firstname, lastname}, historyPush, historyReplace){
    return function (dispatch){
        axios.post(`${ROOT_URL}/signup`, {email, password, firstname, lastname})
        .then(response => {
            historyPush('/signin', { time: new Date().toLocaleString(), message: response.data.massage });
        })
        .catch(({response}) => {
            historyReplace('/signup', { time: new Date().toLocaleString(), message: response.data.message});
        });
    }
}

export function signoutUser() {
    localStorage.removeIthem('token');
    return { type: UNAUTH_USER };
}

export function verifyJwt(){
    return function (dispatch) {
        axios.get(`${ROOT_URL}/verify_jwt`, {
            headers: { authorization: localStorage.getItem('token') }
        }).then((response) => {
            dispatch({
                type: AUTH_USER,
                payload: response.data.username,
            });
        });
    }
}

// User Informaion

export function fetchProfile() {

    return function(dispatch) {
        axios.get(`${ROOT_URL}/profile`, {
            headers: { authorization: localStorage.getItem('token') }
        }).then(response => {
            dispatch({
                type: FETCH_PROFILE,
                payload: response.data.user,
            });
        });
    }

}

export  function clearProfile() {
    return { type: CLEAR_PROFILE };
}

export function updateProfile({ firstname, lastname, birthday, sex, phone, address, occupation, description }, historyReplace) {

    return function(dispatch) {
        axios.put(`${ROOT_URL}/profile`, {
            firstname,
            lastname,
            birthday,
            sex,
            phone,
            address,
            occupation,
            description,
        }, {
            headers: {authorization: localStorage.getItem('token')},
        }
        )
        .then((response) => {
            dispatch({
                type: UPDATE_PROFILE,
                payload: response.data.user,
            });
            dispatch({
                type: AUTH_USER,
                paylaod: response.data.user.firstName + ' ' + response.data.user.lastName,
            });
            historyReplace('/profile', {
                status: 'success',
                time: new Date().toLocaleString(),
                message: 'Profile has been successfully updated.',
            });
        })
        .catch(() => {
            historyReplace('/profile', {
            status: 'fail',
            time: new Date().toLocaleString(),
            message: 'Failed to update profile. Please try again.',
            });
        });
    }
}

export function changePassword({ oldPassword, newPassword}, historyReplace) {

    return function(dispatch) {
        axios.put(`${ROOT_URL}/password`, {
            oldPassword,
            newPassword,
        },{
            headers: { authorization: localStorage.getItem('token')},
        })
        .then((response) => {
            dispatch(reset('settings'));
            historyReplace('/settings', {
                status: 'success',
                time: new Date().toLocaleString(),
                message: response.data.massage,
            });
        })
        .catch(({response}) => {
            historyReplace('/settings', {
                status: 'fail',
                time: new Date().toLocaleString(),
                message: response.data.message,
            });
        });
    }
}

// Blog Post

export function fetchPost() {

    return function(dispatch) {
        axios.get(`${ROOT_URL}/posts`).then((response) => {
            dispatch({
                type: FETCH_POSTS,
                payload: response.data,
            });
        });
    }
}

export function cretaePost({ title, categories, content }, historyPush, historyReplace) {

    return function(dispatch) {
        axios.post(`${ROOT_URL}/posts`, {
            title,
            categories,
            content,
        }, {
            headers: { authorization: localStorage.getItem('token')},
        })
        .then((response) => {
            dispatch({
                type: CREATE_POST,
                payload: response.data,
            });
            historyPush(`/posts/${response.data.id}`);
        })
        .catch(({response}) => {
            historyReplace('/posts/new', {
                time: new Date().toLocaleString(),
                message: response.data.massage,
            });
        });
    }
}

export function fetchPost(id) {

    return function(dispatch) {
        axios.get(`${ROOT_URL}/posts/${id}`).then(response => {
            console.log(response);
            dispatch({
                type: FETCH_POST,
                payload: response.data,
            });
        });
    }
}

export function updatePost({ _id, title, categories, content}, onEditSuccess, historyReplace) {

    return function(dispatch) {
        axios.put(`${ROOT_URL}/posts/${_id}`, {
           _id,
           title,
           categories,
           content, 
        }, {
            headers: {authorization: localStorage.getItem('token')},
        })
        .then((response) => {
            dispatch({
                type: UPDATE_POST,
                payload: response.data,
            });
            onEditSuccess();
            historyReplace(`/posts/${_id}`, {
                time: new Date().toLocaleString(),
                message: response.data.massage,
            });
        });
    }
}


export function deletePost(id, historyPush) {

    return function(dispatch) {
        axios.delete(`${ROOT_URL}/posts/${id}`, {
            headers: {authorization: localStorage.getItem('token')},
        }).then((response) => {
            dispatch({
                type: DELETE_POST,
                payload: id,
            });
            historyPush('/posts');
        })
    }
}


export function fetchPostsByUserId() {

    return function(dispatch) {
        axios.get(`${ROOT_URL}/my_posts`, {
            headers: {authorization: localStorage.getItem('token')},
        })
        .then((response) => {
            dispatch({
                type: FETCH_POSTS,
                payload: response.data,
            });
        });
    }
} 



// Blog Comments


export function createComment({ comment, postId }, clearTextEditor, historyReplace) {

    return function(dispatch) {
        axios.post(`${ROOT_URL}/comments/${postId}`, {content: comment }, {
            headers: {authorization: localStorage.getItem('token')},
        })
        .then((response) => {
            dispatch({
                type: CREATE_COMMENT,
                payload: response.data,
            });
            dispatch(reset('comment_new'));
            clearTextEditor();
            historyReplace(`/post/${postId}`, null);
        })
        .catch(({response}) => {
            if (!response.data.message) {
                return historyReplace(`/posts/${postid}`, {
                    time: new Date().toLocaleString(),
                    message: 'You must sign in before tou can psot new comment.',
                });
            }

            historyReplace(`/posts/${postId}`, {
                time: new Date().toLocaleString(),
                message: response.data.message,
            });
        });
    }
}


export function fetchComments(postId) {

    return function(dispatch) {
        axios.get(`${ROOT_URL}/comments/${postId}`).then((response) => {
            dispatch({
                type: FETCH_COMMENTS,
                payload: response.data,
            });
        });
    }
}



// Check authorization


export function checkAuthority(postId) {

    return function(dispatch) {
        axios.get(`${ROOT_URL}/allow_edit_or_delete/${postId}`, {
            headers: {authorization: localStorage.getItem('token')},
        }).then((response) => {
            dispatch({
                type: CHECK_AUTHORITY,
                payload: response.data.allowChange,
            });
        }).catch(() => {
            dispatch({
                type: CHECK_AUTHORITY,
                payload: false,
            })
        });
    }
}