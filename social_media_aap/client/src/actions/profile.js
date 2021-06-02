import axios from 'axios';
import setAlert  from './alert';
import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILES,
    GET_REPOS
} from './types'

// Get the current user profile
export const getCurrentProfile = () => async dispatch => {
    try{
        const res = await axios.get('/api/profile/me'); 
        // console.log(res.data)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    }catch(err){
        console.log(err)
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}



//Get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({ type:CLEAR_PROFILE })

    try{
        const res = await axios.get('/api/profile'); 
        // console.log(res.data)
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });

    }catch(err){
        console.log(err)
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}



//Get profile by id
export const getProfileById = userId => async dispatch => {

    try{
        const res = await axios.get(`/api/profile/user/${userId}`); 
        // console.log(res.data)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    }catch(err){
        console.log(err)
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}



//Get Github Repos
export const getGithubRepos = username => async dispatch => {

    try{
        const res = await axios.get(`/api/profile/github/${username}`); 
        // console.log(res.data)
        dispatch({
            type: GET_REPOS,
            payload: res.data
        });

    }catch(err){
        console.log(err)
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}





// Create or Update profile
export const createProfile = ( formData, history, edit=false) => async dispatch => {
    try{
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.post('/api/profile', formData, config);
        
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created','success'))

        if(!edit){
            history.push('/dashboard')
        }
    }catch(err){
        const errors = err.response.data.errors;
        // console.log(errors)
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};


// Add experience
export const addExperience = (formData, history)=> async dispatch => {
    try{
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.put('/api/profile/experience', formData, config);
        
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Added','success'))
            history.push('/dashboard')
    }catch(err){
        const errors = err.response.data.errors;
        // console.log(errors)
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};


// Add Education
export const addEducation  = (formData, history)=> async dispatch => {
    try{
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.post('/api/profile/education', formData, config);
        
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Added','success'))
            history.push('/dashboard')
    }catch(err){
        const errors = err.response.data.errors;
        // console.log(errors)
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Delete Experience
export const deleteExperience = id => async dispatch => {
    try{
        const res = await axios.delete(`/api/profile/experience/${id}`);

        console.log(res.data)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Deleted','success'))
    }catch(err){
        dispatch({
            type: PROFILE_ERROR,
        });
    }
};


// Delete Education
export const deleteEducation = id => async dispatch => {
    try{
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education Deleted','success'))
    }catch(err){
        console.log(err.response)
        // dispatch({
        //     type: PROFILE_ERROR,
        //     payload: { msg: err.response.statusText, status: err.response.status }
        // });
    }
};


// delete account & profile
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure? This can not be undone'))
    try{
        await axios.delete('/api/profile');

        dispatch({ type: CLEAR_PROFILE })
        dispatch({ type: ACCOUNT_DELETED })

        dispatch(setAlert('Your account has been pemanantly deleted','success'))
    }catch(err){
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};