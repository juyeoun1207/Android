import {create} from 'zustand'

const vibrationTypeZustand = create((set) => ({
    vibrationType: 'on',
    setVibrationType: (type) => set({vibrationType: type}),
}))

export default vibrationTypeZustand;