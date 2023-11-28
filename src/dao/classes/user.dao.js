import userModel from "../models/user.model.js"

export default class User {
    getByEmail = async (email) => {
        try {
            let user = await userModel.findOne({email: email})
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getById = async(uid) => {
        try {
            let user = await userModel.findById(uid)
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createUser = async(user) =>{
        try{
            let result = await userModel.create(user)
            return result
        }catch(error){
            console.log(error)
            return null
        }
    }

}