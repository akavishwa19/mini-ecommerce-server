import mongoose from "mongoose";

export async function connectDb(){
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('connected to mongo instance succesfully')
    } catch (error) {
        console.log('error connecting dues to '+error.message)
    }
   
}
