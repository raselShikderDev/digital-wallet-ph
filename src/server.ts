import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";

const startServer = async () => {
   try {
      // Connectiing with mongodb
      await mongoose.connect(envVars.MONGO_URI)
       if (envVars.NODE_ENV === "Development") {
        console.log(`Successfully connected with MongoDB`);
      }
   // Starting Server
    app.listen(envVars.PORT as string, () => {
      if (envVars.NODE_ENV === "Development") {
        console.log(`Server is running at http://localhost:${envVars.PORT}`);
      }
    });
  } catch (error: any) {
    if (envVars.NODE_ENV === "Development") {
      console.log(`Somthing wrong: ${error}`);
    }
    throw new Error("Something Wrong! Starting server has faild");
  }
};

(async () => {
  await startServer();
})();
