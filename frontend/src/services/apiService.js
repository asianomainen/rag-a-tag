const API_URL = '/api/weaviate'

export const postPrompt = async (promptText) => {
    try {
        const response = await fetch(`${API_URL}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: promptText}),
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Error posting prompt:', error)
        throw error
    }
}
