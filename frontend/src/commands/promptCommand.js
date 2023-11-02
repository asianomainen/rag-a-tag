import {postPrompt} from '../services/apiService'

export const promptCommand = async (args) => {
    try {
        const apiResponse = await postPrompt(args)

        const responseObj = JSON.parse(apiResponse.response)

        let output = `AI Answer: \n${responseObj.groupedResult}\n\nReferences:\n`

        output += responseObj.references.map((ref) => `- ${ref}`).join('\n')

        return output
    } catch (error) {
        return `Error: ${error.message}`
    }
}
