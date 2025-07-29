import app from "./app";


app.listen(envVars.PORT as string, ()=>{
   console.log(`Server is running at http://localhost:${envVars.PORT}`);
})