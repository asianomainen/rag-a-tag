import {postPrompt} from '../services/apiService'
import {FormattedGptResponse} from '../components/FormattedGptResponse'

export const promptCommand = async (args) => {
    try {
        const apiResponse = await postPrompt(args)
        const responseObj = JSON.parse(apiResponse.response)

        return <FormattedGptResponse responseObj={responseObj} />
    } catch (error) {
        return `Error: ${error.message}`
    }
}
