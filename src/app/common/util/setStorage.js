const setStorage = (name, data) => (
    localStorage.setItem(name, JSON.stringify(data))
)

export default setStorage;