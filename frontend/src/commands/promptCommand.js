import {someApiCall} from '../services/PromptService'

export const promptCommand = async (args) => {
    try {
        const apiResponse = await someApiCall(args)
        return apiResponse.data
    } catch (error) {
        return `Error: ${error.message}`
    }
}

export const promptDescription = 'Sends a prompt message to AI and waits for a response.'
