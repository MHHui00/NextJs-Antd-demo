import { create } from 'zustand'

export const useLoginStore = create((set) => ({
  loginStatus: false,
  setLogin: ()=> set(state=>({loginStatus: !(state.loginStatus)})),

  uid: -1,
  setUid: (fetchId)=> set({uid: fetchId}),

  username: 'user',
  setUsername: (fetchUname)=> set({username: fetchUname}),


  // setLogin: () => set((state) => ({ loginStatus: true })),
  // removeAllBears: () => set({ bears: 0 }),
  // updateBears: (newBears) => set({ bears: newBears }),
}))