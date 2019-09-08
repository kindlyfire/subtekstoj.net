import React from 'react'
import './App.css'
import Header from '../Header/Header'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Index from '../../pages/Index/Index'

function App() {
    return (
        <Router>
            <div className="App">
                <Header></Header>

                <Route exact path="/" component={Index} />
            </div>
        </Router>
    )
}

export default App
