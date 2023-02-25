const getItem = (value: string)=>{
    return localStorage.getItem(value)
}

const setItem = (k:string, v:string)=>{
    localStorage.setItem(k, v)
}

const removeItem = (value:string)=>{
    localStorage.removeItem(value)
}

const getId = (id: string)=>{
    return localStorage.getItem(id)
}

const setId = (k:string, v:string)=>{
    localStorage.setItem(k, v)
}

const removeId = (id:string)=>{
    localStorage.removeItem(id)
}


export {
    getItem,
    setItem,
    removeItem,
    getId,
    setId,
    removeId
}