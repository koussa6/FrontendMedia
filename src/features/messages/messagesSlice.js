import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  messages: [],
};
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ token, userId }) => {
    const { data } = await api.post(
      '/api/message/get',
      { to_user_id: userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data.success ? data : null;
  },
);
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Option A: Use curly braces to avoid returning the assignment
    sendMessages: (state, action) => {
      state.messages = action.payload;
    },

    // Option B: Just push to the array (Immer handles the "mutation" safely)
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    // Option C: Use curly braces here too
    resetMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      if (action.payload) state.messages = action.payload.messages;
    });
  },
});
export const { sendMessages, addMessage, resetMessages } = messageSlice.actions;
export default messageSlice.reducer;
