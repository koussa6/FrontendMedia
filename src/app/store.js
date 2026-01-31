import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/users/userSlice.js';
import messageReducer from '../features/messages/messagesSlice.js';
import connectionReducer from '../features/connections/connectionsSlide.js';

export const store = configureStore({
  reducer: {
    user: usersReducer,
    messages: messageReducer,
    connections: connectionReducer,
  },
});
