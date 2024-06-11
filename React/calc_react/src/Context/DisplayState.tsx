import {useState} from 'react'

export interface DisplayStateInterface {
    visor: string
}

export default function useDisplayState () {

    const [displayState, setDisplayState] = useState<DisplayStateInterface>({
        visor: '0'
    })

    return {displayState, setDisplayState}

}