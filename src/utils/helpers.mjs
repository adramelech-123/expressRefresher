import bcrypt from "bcrypt"


const saltRounds = 10

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password, salt)
}

export const comparePassword = (plain, hashed) => {
    // The compare function returns a boolean -> True if the passwords match
    return bcrypt.compareSync(plain, hashed)
}