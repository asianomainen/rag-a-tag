import React from 'react'
import Particles from 'react-particles'
import {loadLinksPreset} from 'tsparticles-preset-links'

export class ParticlesContainer extends React.PureComponent {
    async customInit(engine) {
        await loadLinksPreset(engine)
    }

    render() {
        const options = {
            background: {
                color: '#000000',
            },
            particles: {
                color: '#00FF00',
                number: {
                    value: 100,
                },
                links: {
                    distance: 150,
                    enable: true,
                    color: '#00FF00',
                    triangles: {
                        enable: true,
                        opacity: 0.01,
                    },
                },
                move: {
                    enable: true,
                },
                size: {
                    value: 1,
                },
                shape: {
                    type: 'circle',
                },
            },
        }

        return <Particles options={options} init={this.customInit.bind(this)} />
    }
}
