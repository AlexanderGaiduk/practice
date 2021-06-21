import {GET_PHOTOS, PhotosAction, PhotosState, SET_ERROR} from "../types";
import {Photo} from "pexels";


const initialState: PhotosState = {
    photos: [],
    total_results: 0,
    error: ""
}

const photoReducer = (state = initialState, action: PhotosAction): PhotosState => {
    switch(action.type) {
        case GET_PHOTOS:
            const {page, photos, total_results} = action.payload
            let photosArr: Photo[] = []
            if (page > 1) {
                photosArr = [...state.photos, ...photos]
            }
            else {
            photosArr = photos
            }
            return {
                ...state,
                photos: photosArr,
                total_results: total_results,
                error: ""
            }
        case SET_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state
    }
}

export default photoReducer