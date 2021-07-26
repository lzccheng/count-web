export const getLs = key => {
    let val = window.localStorage.getItem(key)
    if (val) {
        try {
            val = JSON.parse(val)
        } catch (e) {}
    }
    return val
}

export const setLs = (key, val) => {
    window.localStorage.setItem(key, JSON.stringify(val))
}