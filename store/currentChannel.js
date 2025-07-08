import {create} from 'zustand'

const currentChannelZustand = create((set) => ({
	currentChannel:'',
	setCurrentChannel: (id) => set({currentChannel:id}),
}))

export default currentChannelZustand;