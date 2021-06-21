import React, {FC, useEffect, useState, MouseEvent, Fragment} from "react";
import {useDispatch, useSelector} from "react-redux";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import './App.css';

import {getPhotos, getCuratedPhotos, setError} from "./store/actions/photosActions";
import {RootState} from "./store";
import Intro from "./components/intro";
// import {Photo} from 'pexels';

const App: FC = () => {
    const dispatch = useDispatch()
    const {photos, total_results, error} = useSelector((state: RootState) => state.photos)
    const [mode, setMode] = useState("trending")
    const [loading, setLoading] = useState(true)
    const [searchFor, setSearchFor] = useState("")
    const [page, setPage] = useState(1)
    const [title, setTitle] = useState("Бесплатные стоковые фото")
    const [btnLoading, setBtnLoading] = useState(false)

    useEffect(() => {
        dispatch(getCuratedPhotos(1, () => setLoading(false), () => setLoading(false)))
    }, [dispatch])

    // useEffect(() => {
    //     document.addEventListener("scroll", scrollHandler)
    //     return () => {
    //         document.removeEventListener("scroll", scrollHandler)
    //     }
    // }, [])

    const searchPhotosHandler = (query: string) => {
        if(error) {
            setError("")
        }
        setMode("search")
        setLoading(true)
        setSearchFor(query)
        setPage(1)
        dispatch(getPhotos(1, query, () => setLoading(false), () => setLoading(false)))
        setTitle(`Фото На Тему "${query}"`)
    }

    const loadMoreHandler = () => {
        setBtnLoading(true);
        setPage(prev => prev + 1);
        if(mode === 'trending') {
            dispatch(getCuratedPhotos(page + 1, () => setBtnLoading(false), () => setBtnLoading(false)));
        }else {
            dispatch(getPhotos(page + 1, searchFor, () => setBtnLoading(false), () => setBtnLoading(false)));
        }
    }

    // const scrollHandler = (e: any) => {
    //     if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100
    //         && photos.length < total_results){
    //
    //     }
    // }

    // const showTrendingPhotos = () => {
    //     setLoading(true)
    //     setTitle("Бесплатные стоковые фото")
    //     setMode("trending")
    //     dispatch(getCuratedPhotos(1, () => setLoading(false), () => setLoading(false)))
    // }

    let content = null

    if(loading) {
        content = <div className="is-flex is-justify-content-center py-6"><div className="loading"> </div></div>
    }
    else{
        content = (
            error
                ? <div className="notification is-danger mt-6 has-text-centered">{error}</div>
                : <Fragment>
                    {/*{mode === "search" && <div className="is-flex is-justify-content-center pt-5">*/}
                    {/*    <button className="button is-link" onClick={showTrendingPhotos}>Назад к тенденциям</button>*/}
                    {/*</div>}*/}
                    <h2 className="is-size-3 py-3">{title}</h2>
                    {photos.length > 0
                        ? <ResponsiveMasonry columnsCounterBreakPoints={{480: 2, 900: 3}}>
                            <Masonry glutter={20}>
                                {photos.map(photo => (
                                    <div key={photo.id} className="masonry-item">
                                        <a href="/#" onClick={(e) => {}}>
                                            <img src={photo.src.large} alt="" />
                                        </a>
                                    </div>
                                ))}
                            </Masonry>
                        </ResponsiveMasonry>
                        : <p className="has-text-centered">Нет результатов</p>
                    }

                    <div className="is-flex is-justify-content-center py-3">
                        {((total_results > page * 6) || mode === "trending")
                        && <button className="button is-primary is-large" onClick={loadMoreHandler} disabled={btnLoading}>
                            {!btnLoading ? "Загрузить ещё" : <div className="loading loading--small"></div>}
                        </button>
                        }
                    </div>
                </Fragment>
        )
    }

    return (
    <div>
      <Intro onSearch={searchPhotosHandler} />
        <div className="container px-4">
            {content}
        </div>
    </div>
  );
}

export default App;
