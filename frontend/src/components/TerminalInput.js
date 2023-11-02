import React, {useEffect, useState} from 'react'
import {Terminal} from 'primereact/terminal'
import {TerminalService} from 'primereact/terminalservice'
import {commandHandlers} from './commandRegistry'

const TerminalInput = () => {
    const [isLoading, setIsLoading] = useState(false)
    let loadingInterval = null

    const startLoadingAnimation = () => {
        const characters = ['|', '/', '-', '\\']
        let index = 0

        loadingInterval = setInterval(() => {
            TerminalService.emit('response', `Processing, please wait ${characters[index]}`)
            index = (index + 1) % characters.length
        }, 150)
    }

    const stopLoadingAnimation = () => {
        if (loadingInterval) {
            clearInterval(loadingInterval)
            loadingInterval = null
        }
    }

    const handleCommand = async (text) => {
        if (isLoading) {
            return
        }
        const [command, ...args] = text.split(' ')
        const commandFunction = commandHandlers[command]?.handler

        if (commandFunction) {
            setIsLoading(true)
            startLoadingAnimation()
            TerminalService.emit('response', 'Processing, please wait \\')
            try {
                const response = await commandFunction(args.join(' '))
                TerminalService.emit('response', response)
            } catch (error) {
                TerminalService.emit('response', `Error: ${error.message}`)
            } finally {
                stopLoadingAnimation()
                setIsLoading(false)
            }
        } else {
            TerminalService.emit('response', `Unknown command: ${command}`)
        }
    }

    useEffect(() => {
        TerminalService.on('command', handleCommand)
        return () => TerminalService.off('command', handleCommand)
    }, [])

    return (
        <div>
            <Terminal
                className="term"
                welcomeMessage="Welcome! Enter 'help' to see available commands. (https://locu.sx/)"
                prompt="lcx $"
                disabled={isLoading}
                pt={{
                    commandText: {
                        readOnly: isLoading,
                        style: {
                            fontSize: 'inherit',
                        },
                    },
                    container: {
                        style: {
                            opacity: isLoading ? 0 : 1,
                        },
                    },
                }}
            />
        </div>
    )
}

export default TerminalInput
