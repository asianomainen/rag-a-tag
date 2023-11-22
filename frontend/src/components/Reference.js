export const Reference = ({reference, isModalOpen, setIsModalOpen, setCurrentReference}) => {
    console.log(reference)

    return (
        <div style={{display: 'flex'}}>
            <span>- </span>
            <button
                id="ref"
                key={reference?.chunk_index}
                onClick={() => {
                    setIsModalOpen(!isModalOpen)
                    setCurrentReference(reference)
                }}
            >
                {reference?.chunk_index}
            </button>
        </div>
    )
}
