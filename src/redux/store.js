// src/redux/store.js
import { createStore } from 'redux';

const initialState = {
    song: null,
    isPlaying: false,
    progress: 0,
    picUrl: null,
    audio: null,
};

function playerReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_SONG':
            return { ...state, song: action.song };
        case 'TOGGLE_PLAY':
            return { ...state, isPlaying: !state.isPlaying };
        case 'SET_PROGRESS':
            return { ...state, progress: action.progress };
        case 'SET_PIC':
            return { ...state, picUrl: action.picUrl };
        case 'SET_AUDIO':
            return { ...state, audio: action.audio };
        default:
            return state;
    }
}

const store = createStore(playerReducer);

export default store;
