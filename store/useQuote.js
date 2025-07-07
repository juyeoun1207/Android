import { create } from 'zustand'

const useQuoteZustand = create((set) => ({
  quoteList: [
    {name: '1번', type: '기본', text: "잠시 잊은 할 일 없었나요?"},
    {name: '2번', type: '기본', text: "다시 집중할 시간입니다."},
    {name: '3번', type: '기본', text: "지금 이 순간을 담아보면 어떨까요?"},
    {name:'RM', type: 'BTS', text:'책 한 장 넘겨볼 시간이에요.'},
    {name:'JIN', type: 'BTS', text:'핸드폰 잠깐 놓고 맛있는 거 먹자!'},
    {name:'SUGA', type: 'BTS', text:'다른 걸로 기분 전환하러 가자'},
    {name: 'J-HOPE', type: 'BTS', text: '우리 같이 몸을 살짝 움직여볼까?'},
    {name: 'JIMIN', type: 'BTS', text: '조금만 쉬면서 나를 돌봐줘요.'},
    {name: 'V', type: 'BTS', text: '사진 한 장 찍으러 가볼래?'},
    {name: 'JUNGKOOK', type: 'BTS', text: '지금 잠깐 손을 비워봐요!'},
    {name:'YUNAH', type: 'ILLIT', text:'지금은 잠깐 다른 걸 해봐요.'},
    {name:'MINJU', type: 'ILLIT', text:'핸드폰 말고 나랑 놀자!'},
    {name:'MOKA', type: 'ILLIT', text:'우리 잠깐 멍때리기 타임 어때요?'},
    {name: 'WONHEE', type: 'ILLIT', text: '눈도 쉬어야 해요! 잠깐 멀리 보기~'},
    {name: 'IROHA', type: 'ILLIT', text: '폰 잠깐 멈추고 춤 한 번 춰볼까?'},
  ],

  selectedQuote: "잠시 잊은 할 일 없었나요?",

  setSelectedQuote: (quote) => set({ selectedQuote: quote }),

  addQuote: (newQuote) =>
    set((state) => ({ quoteList: [...state.quoteList, newQuote] })),
}));

export default useQuoteZustand;