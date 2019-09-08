import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <header className="Header-background">
            <div className="container">
                <div className="Header">
                    <Link to="/" className="Header-brand">
                        Subtitolo
                    </Link>

                    <Link to="/series" className="Header-link">
                        Serioj
                    </Link>
                    <Link to="/movies" className="Header-link">
                        Filmoj
                    </Link>

                    <Link to="/movies" className="Header-link ml-auto">
                        Ensaluti
                    </Link>
                </div>
            </div>
        </header>
    )
}
