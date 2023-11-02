import './assets/theme.css'
import './App.css'

import React, {useEffect, useState} from 'react'
import TerminalInput from './components/TerminalInput'
import {ParticlesContainer} from './components/ParticlesContainer'
import {Skeleton} from 'primereact/skeleton'
import {Dialog} from 'primereact/dialog'
import {Button} from 'primereact/button'

function App() {
    const [showModal, setShowModal] = useState(true)
    const [skeletonClass, setSkeletonClass] = useState('skeleton-fade')

    useEffect(() => {
        if (!showModal) {
            setSkeletonClass('skeleton-fade skeleton-fade-out')
            const timer = setTimeout(() => {
                setSkeletonClass('')
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [showModal])

    return (
        <div className="main-container">
            <ParticlesContainer />
            <Dialog
                header="Welcome"
                visible={showModal}
                modal
                onHide={() => setShowModal(false)}
                position="top"
                maximizable
                style={{width: '50vw'}}
                contentStyle={{fontSize: '0.9em'}}
            >
                <p>
                    <strong>Welcome to our Chat Application PoC!</strong> <br />
                    This platform is an innovative blend of technology and research, brought to you by the Computer
                    Science Project course at the University of Helsinki. Here’s what makes our application unique:
                </p>
                <p>
                    At its core, our application employs a Retrieval-Augmented Generation (RAG) approach, seamlessly
                    integrated with the cutting-edge capabilities of OpenAI's Large Language Models (LLMs). This
                    combination allows for dynamic, context-aware, and deeply informed interactions.
                </p>
                <p>How does it work? It's quite intriguing:</p>
                <ul>
                    <li>
                        When you send us a query, say, <em>"Tell me about microservice architecture,"</em> our backend
                        springs into action. It carefully extracts key entities from your query, like identifying
                        "Microservice Architecture" as the main subject.
                    </li>
                    <li>
                        Next, we transform these entities into rich, semantic embeddings, ready to be understood by our
                        AI.
                    </li>
                    <li>
                        These embeddings, alongside your original query, are then sent through Weaviate's hybrid search
                        system. This step ensures that the response is not only accurate but also contextually rich.
                    </li>
                    <li>
                        Finally, the amalgamation of documents sourced from Weaviate and your original question is fed
                        to the OpenAI LLM. This is where the magic happens - our AI formulates a response, nuanced and
                        tailored to your query.
                    </li>
                </ul>
                <p>
                    So go ahead, press <strong>OK</strong> and start your journey into the world of advanced chat
                    interfaces, where technology meets human-like understanding.
                </p>
                <Button label="OK" onClick={() => setShowModal(false)} />
            </Dialog>
            {skeletonClass && (
                <div className={skeletonClass} style={{position: 'absolute', zIndex: 2}}>
                    <Skeleton width="800px" height="500px" />
                </div>
            )}
            {!showModal && <TerminalInput />}
        </div>
    )
}

export default App
