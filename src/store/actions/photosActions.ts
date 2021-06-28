import {createClient, ErrorResponse, PhotosWithTotalResults, Photos} from "pexels";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {GET_PHOTOS, PhotosAction, SET_ERROR} from "../types";

export const client = createClient("563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf")

export const getPhotos = (page: number, searchQuery: string, onSuccess: () => void, onError: () => void): ThunkAction<void, RootState, null, PhotosAction> => {
    return async dispatch => {
        try{
            const photos: PhotosWithTotalResults | ErrorResponse = await client.photos.search({page, query: searchQuery, per_page: 6})

           if("error" in photos) {
               throw new Error(photos.error)
           }
           else{
               dispatch({
                   type: GET_PHOTOS,
                   payload: {
                       photos: photos.photos,
                       page: page,
                       total_results: photos.total_results
                   }
               })
               onSuccess()
           }
        }
        catch (err){
            dispatch(setError(err.message))
            onError()
        }
    }
}

export const getCuratedPhotos = (page: number, onSuccess: () => void, onError: () => void): ThunkAction<void, RootState, null, PhotosAction> => {
    return async dispatch => {
        try {
            const photos: Photos | ErrorResponse = await client.photos.curated({page, per_page: 6})

            if("error" in photos) {
                throw new Error(photos.error)
            }
            else{
                dispatch({
                    type: GET_PHOTOS,
                    payload: {
                        photos: photos.photos,
                        page: page,
                        total_results: 0
                    }
                })
                onSuccess()
            }
        }
        catch (err){
            dispatch(setError(err.message))
            onError()
        }
    }
}

export const setError = (err: string): PhotosAction => {
    return {
        type: SET_ERROR,
        payload: err
    }
}
