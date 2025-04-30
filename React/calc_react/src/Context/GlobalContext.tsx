import {createContext} from 'react';
import { DisplayStateInterface } from './DisplayState';

export interface GlobalContextInterface {

    displayState: DisplayStateInterface
    setDisplayState: React.Dispatch<React.SetStateAction<DisplayStateInterface>>
    
}

export const GlobalContext = createContext<GlobalContextInterface | null>(null)