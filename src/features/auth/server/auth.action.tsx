"use server"
//* 👉 Server Actions in Next.js are special functions that run only on the server, not in the user’s browser.

//* They let you perform things like database queries, API calls, form submissions, or data mutations directly from your React components — without creating a separate API route.

//* You just mark a function with "use server", and Next.js automatically runs it on the server.

//* When you submit a <form> in Next.js using action={yourServerAction}, the framework sends a FormData object to that server function.

//* FormData is a built-in Web API type (just like Request, Response, or URLSearchParams).

//* It provides methods like .get(), .set(), .append(), and .entries() — which you’re already using here.

import { db } from '@/config/db';
import { users } from '@/drizzle/schema';
import  argon2  from 'argon2';
import { eq, or } from 'drizzle-orm';
import React from 'react'
import { RegisterUserData, registerUserSchema } from '../auth.schema';

const registrationAction = async (formData : RegisterUserData) => {
  try {
    const {data : validatedData , error} =  registerUserSchema.safeParse(formData); 
    
    if(error) return {status : "ERROR" , message : error.issues[0].message}; 

      const {name , email , password , userName , role} = validatedData;
    
      const [user] = await  db.select().from(users).where(or(eq(users.email , email) , eq(users.userName , userName)));
      
      console.log(user); 

      if(user){
         if(user.email === email){
           return {
            status : "ERROR",
            message : "Email Already Exists",
           }
         }else{
           return {
            status : "ERROR",
            message : "Username Already Exists", 
           }
         }
      }

      const hashPassword = await argon2.hash(password);
      await db.insert(users).values({ name , email , password : hashPassword , userName , role })

     return {
       status : "SUCCESS",
       message : "Registration Completed Successfully",
     }
    
  } catch (error) {
      console.error("Registration Error:", error);
      return {
       status : "ERROR",
       message : "Unknown Error Occured ! Please Try Again Later",
     }
  } 
  
}

export default registrationAction    

export const loginUserAction = async (formData : {
  email : string ;
  password : string;
} ) =>{
  try {
     const {email , password} = formData;
     console.log("Inside th auth actions" , formData);

     const [user] = await db.select().from(users).where(eq(users.email , email));
     
     console.log("Inside the auth actions" , user);

     if(!user){
         return {
             status : "ERROR",
             message : "Invalid email or password",
           }
        }

    // Safeguard: Check if the stored password is a valid hash (starts with $)
    // This prevents the "pchstr must contain a $" crash if DB has plain text passwords
    if (!user.password || !user.password.startsWith('$')) {
      console.error("Invalid password hash in DB for user:", email);
      return {
        status: "ERROR",
        message: "Invalid email or password",
      };
    }

    const isValidPassword = await argon2.verify(user.password , password);

    if(isValidPassword){
       return {
        status : "SUCCESS",
        message : "Login Successful",
       }
    }
    else{
      return {
             status : "ERROR",
             message : "Invalid email or password",
           }
    }

  } catch (error) {
     console.error("Login Error:", error);
     return {
       status : "ERROR",
       message : "Unknown Error Occured ! Please Try Again Later",
     }
  }
}