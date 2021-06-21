import React, {FC, FormEvent, useState} from "react";
import Input from "./input";
// import {Photo} from 'pexels';


interface IntroProps{
    onSearch: (value: string) => void
}

const Intro: FC<IntroProps> = ({onSearch}) => {
   const [search, setSearch] = useState("")

    const submitHandler = (e: FormEvent) => {
       e.preventDefault()
       onSearch(search)
    }

    return(
        <section className="hero is-medium is-dark has-text-centered">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title is-uppercase-mb-6">Лучшие бесплатные стоковые фото от талантливых авторов.</h1>
                    <form onSubmit={submitHandler} className="form">
                        <Input className="field" value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder="Поиск..." />
                        <button className="button is-medium is-align-content-center">
                            <i className="rd__svg-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                                </svg>
                            </i>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Intro

