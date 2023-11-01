import './assets/theme.css'
import './App.css'

import React from 'react'
import TerminalInput from './components/TerminalInput'
import {ParticlesContainer} from './components/ParticlesContainer'

function App() {
    return (
        <div className="main-container">
            <ParticlesContainer />
            <TerminalInput />
        </div>
    )
}

export default App
