const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'

export const postPrompt = async (promptText) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/weaviate/search`, {
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
