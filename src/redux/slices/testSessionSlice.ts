import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CurrentUserAnswerValue } from '@/schemas/sessionTest';

export type UserAnswer = CurrentUserAnswerValue;

export type TestSessionState = {
  answers: Array<UserAnswer>;
  score: number | null;
};

const initialState: TestSessionState = {
  answers: [],
  score: null,
};

const testSessionSlice = createSlice({
  name: 'testSession',
  initialState,
  reducers: {
    saveUserAnswer: (state, action: PayloadAction<UserAnswer>) => {
      const { questionId, selectedAnswerId, numericAnswer } = action.payload;
      const existingAnswer = state.answers.find(
        (a) => a.questionId === questionId
      );
      if (existingAnswer) {
        existingAnswer.selectedAnswerId = selectedAnswerId;
        existingAnswer.numericAnswer = numericAnswer;
      } else {
        state.answers.push(action.payload);
      }
    },

    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },

    resetSession: (state) => {
      state.answers = [];
      state.score = null;
    },
  },
});

export const { saveUserAnswer, setScore, resetSession } =
  testSessionSlice.actions;
export default testSessionSlice.reducer;
