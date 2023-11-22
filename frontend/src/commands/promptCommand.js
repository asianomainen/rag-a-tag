import {Test} from './Test'

export const promptCommand = async (args) => {
    try {
        //const apiResponse = await postPrompt(args)

        const responseObj = {
            groupedResult: 'answer',
            references: [
                {chunk_index: 'Eka Chunkki', content: 'tekstiä ekasta chunkista wuwuuwuw'},
                {chunk_index: 'Toka Chunkki', content: 'yoyoyo tokaa tekstiä'},
            ],
        }

        //const responseObj = JSON.parse(apiResponse.response)

        return <Test responseObj={responseObj} />
    } catch (error) {
        return `Error: ${error.message}`
    }
}
