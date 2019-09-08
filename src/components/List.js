import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { removeTodo } from '../store/modules/todo/actions';

export default function List() {
    const dispatch = useDispatch();
    const list = useSelector(state => state.todo);

    if (list.length === 0) {
        return <span>Todo list is empty :)</span>;
    }

    function handleRemove(index) {
        dispatch(removeTodo(index));
    }

    return (
        <ul>
            {list.map((item, index) => (
                <li key={index}>
                    <span>{item} </span>
                    <button type="button" onClick={() => handleRemove(index)}>
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
}
