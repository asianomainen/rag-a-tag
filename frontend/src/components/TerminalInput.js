import React, {useEffect} from 'react'
import {Terminal} from 'primereact/terminal'
import {TerminalService} from 'primereact/terminalservice'
import {commandHandlers} from './commandRegistry'

const TerminalInput = () => {
    const handleCommand = async (text) => {
        const [command, ...args] = text.split(' ')
        const commandFunction = commandHandlers[command]?.handler
        const response = commandFunction ? await commandFunction(args.join(' ')) : `Unknown command: ${command}`

        TerminalService.emit(response ? 'response' : 'clear', response)
    }

    useEffect(() => {
        TerminalService.on('command', handleCommand)
        return () => TerminalService.off('command', handleCommand)
    }, [])

    return (
        <div className="card">
            <Terminal
                className="term"
                welcomeMessage="Welcome! Enter 'help' to see available commands. (https://locu.sx/)"
                prompt="lcx $"
            />
        </div>
    )
}

export default TerminalInput
