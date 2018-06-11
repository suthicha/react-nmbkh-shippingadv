const delay = () => {
    return new Promise(resolve => setTimeout(resolve, 1000))
}

export default delay;