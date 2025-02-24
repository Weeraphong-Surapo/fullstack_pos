import { atom } from "jotai"

const userInfo = atom({
    id: "",
    username: "",
    first_name: "",
    last_name: "",
    image: "",
    address:"",
    phone:"",
    role: ""
})

export { userInfo }