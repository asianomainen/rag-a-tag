import {promptCommand} from '../commands/promptCommand'
import {helpCommand} from '../commands/helpCommand'

export const commandHandlers = {
    help: {
        handler: () => helpCommand(commandHandlers),
        description: 'Lists all available commands.',
    },
    prompt: {
        handler: promptCommand,
        description: "Calls AI with the prompt. Usage: 'prompt [text]'",
    },
}
