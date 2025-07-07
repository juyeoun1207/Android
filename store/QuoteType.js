import { create } from 'zustand'

const useQuoteStore = create((set) => ({
  quoteList: [
    {name: '기본1', text: "잠시 잊은 할 일 없었나요?"},
    {name: '기본2', text: "다시 집중할 시간입니다."},
    {name: '기본3', text: "지금 이 순간을 담아보면 어떨까요?"},
  ],

  selectedQuote: "잠시 잊은 할 일 없었나요?",

  setSelectedQuote: (quote) => set({ selectedQuote: quote }),

  addQuote: (newQuote) =>
    set((state) => ({ quoteList: [...state.quoteList, newQuote] })),
}));

export default useQuoteStore;
