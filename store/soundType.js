import {create} from 'zustand'

const soundTypeZustand = create((set) => ({
    soundType:'on',
    setSoundType: (type) => set({soundType:type}),
}))

export default soundTypeZustand;