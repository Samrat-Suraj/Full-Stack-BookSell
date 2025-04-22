import mongoose from "mongoose";
import EnvVars from "./EnvVars";

const MongoDb = async () : Promise<void> => {
    try {
        const conn = await mongoose.connect(EnvVars.MONGO_URI as string);
        console.log("MongoDb Connected On",conn.connection.host)
    } catch (error : any) {
        console.log("Error In MongoDb Connection" , error.message)
        process.exit(1)
    }
}

export default MongoDb