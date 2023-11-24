import {useState} from 'react'
import {Dialog} from 'primereact/dialog'
import {Reference} from './Reference'

export const FormattedGptResponse = ({responseObj}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentReference, setCurrentReference] = useState({})

    const textStyle = {display: 'flex', flexDirection: 'column', margin: '10px 0'}

    return (
        <>
            <div style={textStyle}>
                <span>AI Answer:</span>
                <span>{responseObj?.groupedResult}</span>
            </div>
            <div style={textStyle}>
                <span>References:</span>
                {responseObj?.references.map((reference) => {
                    return (
                        <Reference
                            reference={reference}
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            setCurrentReference={setCurrentReference}
                        />
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
