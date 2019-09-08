import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addTodo } from '../store/modules/todo/actions';

export default function Header() {
    const dispatch = useDispatch();
    const [value, setValue] = useState('');

    function handleAdd(e) {
        e.preventDefault();

        if (value.length > 0) {
            dispatch(addTodo(value));
            setValue('');
        }
    }

    return (
        <form onSubmit={handleAdd}>
            <input type="text" value={value} onChange={e => setValue(e.target.value)} />
            <button type="submit">Add</button>
        </form>
    );
}
