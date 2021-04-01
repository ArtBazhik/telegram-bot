export const isChekForLatin = (username) => {
    let checkLatin = /^[a-zA-Z]*$/.test(username);
    let flag = true
    if(!checkLatin) {
        flag = false
        return flag
    }
    return flag
}
