import { randomBytes } from "crypto";

const random =  (size: number) => {
    return new Promise((res, rej) => {
        randomBytes(size, (e, buff) => {
            if (e) {
                // Prints error
                rej(e)
            }
         
            // Prints random bytes of generated data
            res(buff.toString('hex'))
        })
    })
}

export default random