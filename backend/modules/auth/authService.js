const responseUtils = require("utils/responseUtils");
const { User, UserToken } = require("../../models");

const authService ={
    async checkEmail(email) {

        const whereClause = {
            email: email
        }
        const checkEmail = await User.findOne({
            where: whereClause,
        })
        return checkEmail
    },
    async saveToken(data){
        const token = await UserToken.create(data)
        return token
    }
}

module.exports = authService;