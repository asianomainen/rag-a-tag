import {useState} from 'react'
import {Dialog} from 'primereact/dialog'

export const FormattedGptResponse = ({responseObj}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentReference, setCurrentReference] = useState({})
    console.log(responseObj, "obk")

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'column', margin: '10px 0'}}>
                <span>AI Answer:</span>
                <span>{responseObj?.groupedResult}</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', margin: '10px 0'}}>
                <span>References:</span>
                {responseObj?.references.map((ref) => {
                    return (
                        <span>
                            -{' '}
                            <button
                                id="ref"
                                key={ref?.chunk_index}
                                onClick={() => {
                                    setIsModalOpen(!isModalOpen)
                                    setCurrentReference(ref)
                                }}
                            >
                                {ref?.chunk_index}
                            </button>
                        </span>
                    )
                })}
                <Dialog
                    header={`${currentReference.chunk_index}`}
                    visible={isModalOpen}
                    modal
                    onHide={() => setIsModalOpen(false)}
                    position="center"
                    maximizable
                    style={{width: '50vw'}}
                    contentStyle={{fontSize: '0.9em'}}
                >
                    <p>"{currentReference.content}"</p>
                </Dialog>
            </div>
        </>
    )
}
