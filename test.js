const bcrypt = require('bcrypt');
const saltRounds = 10;  


const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed Password:", hashedPassword);
        return hashedPassword;
    } catch (err) {
        console.error("Error hashing password:", err);
    }
};


const password = "8888";
hashPassword(password);

