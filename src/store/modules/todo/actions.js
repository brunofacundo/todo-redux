export function addTodo(value) {
    return {
        type: '@todo/ADD_TODO',
        value
    };
}

export function removeTodo(index) {
    return {
        type: '@todo/REMOVE_TODO',
        index
    };
}
