const initialState = [];

export default function todo(state = initialState, action) {
    switch (action.type) {
        case '@todo/ADD_TODO':
            return [...state, action.value];

        case '@todo/REMOVE_TODO':
            return state.filter((item, i) => i !== action.index);

        default:
            return state;
    }
}
