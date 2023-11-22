import {useState} from 'react'
import {Dialog} from 'primereact/dialog'

export const GptResponse = ({responseObj}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [current, setCurrent] = useState({})

    return (
        <div>
            <div>
                <div>
                    AI Answer: <br />
                    {responseObj.groupedResult}
                </div>
            </div>
            <br />
            <div>
                Refrences: <br />
                {responseObj.references.map((ref) => {
                    return (
                        <>
                            <span>
                                -{' '}
                                <button id="ref"
                                    key={ref.chunk_index}
                                    onClick={() => {
                                        setIsOpen(!isOpen)
                                        setCurrent(ref)
                                    }}
                                >
                                    {ref.chunk_index}
                                </button>
                            </span>
                            <br />
                        </>
                    )
                })}
                <Dialog
                    header={current.chunk_index}
                    visible={isOpen}
                    modal
                    onHide={() => setIsOpen(false)}
                    position="center"
                    maximizable
                    style={{width: '50vw'}}
                    contentStyle={{fontSize: '0.9em'}}
                >
                    <p>Author: Jaska Paska</p>
                    <p>Chunk text: {current.content}</p>
                    <p>Page number: 12</p>
                </Dialog>
            </div>
        </div>
    )
}
