import React from 'react';
import { Provider } from 'react-redux';

import TodoList from './components/TodoList';
import store from './store';

export default function App() {
    return (
        <Provider store={store}>
            <TodoList />
        </Provider>
    );
}
