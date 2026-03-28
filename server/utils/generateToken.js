import { nanoid } from 'nanoid'

const generateToken = () => {
    return nanoid(10) // generates a random 10 character token e.g. "V1StGXR8Z5"
}

export default generateToken