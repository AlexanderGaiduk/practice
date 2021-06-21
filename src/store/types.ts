import {Photo} from "pexels";

export const GET_PHOTOS = "GET_PHOTOS"
export const SET_ERROR = "SET_ERROR"

export interface PhotosState {
    photos: Photo[]
    total_results: number
    error: string
}

interface GetPhotosAction {
    type: typeof GET_PHOTOS
    payload: {
        photos: Photo[]
        page: number
        total_results: number
    }
}

interface SetErrorAction {
    type: typeof SET_ERROR
    payload: string
}

export type PhotosAction = SetErrorAction | GetPhotosAction