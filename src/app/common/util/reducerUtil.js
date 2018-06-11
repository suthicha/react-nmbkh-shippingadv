export const createReducer = (initialState, funcMap) => {
    return (state = initialState, {
        type,
        payload
    }) => {
        const handler = funcMap[type];
        return handler ? handler(state, payload) : state
    }
}