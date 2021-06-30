import React, {FC, useEffect, useState, Fragment, FormEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import './App.css';

import {getPhotos, getCuratedPhotos, setError, client} from "./store/actions/photosActions";
import {RootState} from "./store";
import Input from "./components/input";

const App: FC = () => {
    const dispatch = useDispatch()
    const {photos, total_results, error} = useSelector((state: RootState) => state.photos)
    const [mode, setMode] = useState("trending")
    const [loading, setLoading] = useState(true)
    const [searchFor, setSearchFor] = useState("")
    const [page, setPage] = useState(1)
    const [title, setTitle] = useState("Тенденции")
    const [fetching, setFetching] = useState(true)
    const [navbar, setNavbar] = useState(false)
    const [randomPhoto, setRandomPhoto] = useState({src: {landscape: "", large: "", large2x: "", medium: "", original: "", portrait: "", small: "", tiny: ""}, photographer: "", photographer_url: ""});

    const array = ["мирный", "интерьер", "стол", " студенты", "обувь", "наука", "чай", "здания", "тренироваться", "спорт",
        "берег", "мебель", "иллюстрация", "мир", "красочный", "здоровый", "идея", "фейерверки", "небо", "пляж",
        "абстрактный", "цветок", "красота", "река", "трава", "цветы", "лето", "закат", "фон", "мороженое",
        "пейзаж", "город", "гора", "любовь", "лес", "сад", "зеленый", "море", "девушка", "книги"]

    const ideasForSearch = () => {
        const shuffled = array.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 7)
    }

    const getRandomPhoto = () => {
        client.photos.random()
            .then((res: any) => {
                    setRandomPhoto(res)
            })
            .catch((err) => {
                console.log('err', err)
            })
    }

    useEffect(() => {
        getRandomPhoto()
    },[])

    useEffect(() => {
        dispatch(getCuratedPhotos(1, () => setLoading(false), () => setLoading(false)))
    }, [dispatch])

    useEffect(() => {
        if (fetching) {
            if (mode === 'trending') {
                dispatch(getCuratedPhotos(page + 1, () => setFetching(false), () => setFetching(false)))
            } else {
                dispatch(getPhotos(page + 1, searchFor, () => setFetching(false), () => setFetching(false)))
            }
            setPage(prev => prev + 1)
        } // eslint-disable-next-line
    }, [fetching])

    useEffect(() => {
        document.addEventListener("scroll", scrollHandler)
        return () => {
            document.removeEventListener("scroll", scrollHandler)
        }
    })

    const scrollHandler = (e: any) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setFetching(true)
        }
        if (e.target.documentElement.scrollTop > 170 && mode === "trending") {
            setNavbar(true)
        }
        else {
            setNavbar(false)
        }
    }

    const searchPhotosHandler = (query: string) => {
        if (error) {
            setError("")
        }
        setMode("search")
        setLoading(true)
        setSearchFor(query)
        setPage(1)
        dispatch(getPhotos(1, query, () => setLoading(false), () => setLoading(false)))
        setTitle(`Фото На Тему "${query}"`)
    }

    const showTrendingPhotos = () => {
        setLoading(true)
        setTitle("Тенденции")
        setMode("trending")
        dispatch(getCuratedPhotos(1, () => setLoading(false), () => setLoading(false)))
    }

    interface IntroProps {
        onSearch: (value: string) => void
    }

    const Intro: FC<IntroProps> = ({onSearch}) => {
        const [search, setSearch] = useState("")

        const submitHandler = (e: FormEvent) => {
            e.preventDefault()
            onSearch(search)
        }

        return(
            <div>
                {(navbar || mode === "search") && <nav className="navbar has-background-dark is-fixed-top is-spaced">

                    <div className="navbar-brand mr-4 is-flex is-align-items-center" onClick={showTrendingPhotos}>
                        <div className="is-size-3">
                            <div className = "is-flex">
                                <svg className="mt-2" xmlns = "http://www.w3.org/2000/svg" width = "32px" height = "32px" viewBox = "0 0 32 32" >
                                    <path d="M2 0h28a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" fill="#05A081"/>
                                    <path d="M13 21h3.863v-3.752h1.167a3.124 3.124 0 1 0 0-6.248H13v10zm5.863 2H11V9h7.03a5.124 5.124 0 0 1 .833 10.18V23z" fill="#fff"/>
                                </svg>
                                <div className="has-text-primary-light ml-2">Pexels</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className="form">
                        <Input className="field" value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder="Поиск..." />
                        <button className="button is-large my-6 mr-2">
                            <i>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </i>
                        </button>
                    </form>
                </nav>}
                {mode === "search" && <div className="searchModePadding"/>}

                {mode === "trending" && <div className="hero is-medium has-background-grey-dark has-text-centered" style={{backgroundImage: `url("${randomPhoto.src.original}")`}}>
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title has-text-white is-uppercase-mb-6">Лучшие бесплатные стоковые фото от талантливых авторов.</h1>
                            <form onSubmit={submitHandler} className="form">
                                <Input className="field" value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder="Поиск..." />
                                <button className="button is-medium mr-1">
                                    <i>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20">
                                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                        </svg>
                                    </i>
                                </button>
                            </form>
                        </div>

                        <div className="has-text-white">
                            Идеи для поиска: {
                            ideasForSearch()
                                .map(elem => (
                                    <div className="ideasForSearch" onClick={() => {searchPhotosHandler(elem)}}>{elem}</div>
                                ))
                        }
                        </div>

                        <a className="authorName p-3" href={randomPhoto.photographer_url} target="_blank" rel="noreferrer">
                            <p>Фотограф: {randomPhoto.photographer}</p>
                        </a>
                    </div>
                </div>}
            </div>
        )
    }

    let content

    if (loading) {
        content = <div className="is-flex is-justify-content-center py-6">
            <div className="loading"/>
        </div>
    }
    else {
         content = (
            error
                ? <div className="notification is-danger mt-6 has-text-centered">{error}</div>
                : <Fragment>
                    <h2 className="is-size-3 has-text-centered py-3">{title}</h2>
                    {mode === "search" && <div>Всего: {total_results} фото</div>}
                    {photos.length > 0
                        ? <ResponsiveMasonry columnsCountBreakPoints={{500: 2, 1100: 3, 1900: 4}}>
                            <Masonry gutter={20}>
                                {photos.map(photo => (
                                    <div key={photo.id} className="masonry-item">

                                        <img src={photo.src.large} alt="" />
                                        <div className="overlay">
                                            <a className="has-text-white" href={photo.photographer_url} target="_blank" rel="noreferrer">
                                                <p>{photo.photographer}</p>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </Masonry>
                        </ResponsiveMasonry>
                        : <p className="has-text-centered">Нет результатов</p>
                    }
                    <div className="is-flex is-justify-content-center py-6">
                        {((total_results > page * 6) || mode === "trending") && fetching && <div className="loading"/>}
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
  )
}

export default App
