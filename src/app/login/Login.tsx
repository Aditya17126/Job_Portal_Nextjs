import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginUserAction } from '@/features/auth/server/auth.action'
import { Eye, EyeOff, Lock, Mail, UserCheck } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface LoginFormData {
  email : string;
  password : string;
}


const Login = () => {
   const [showPassword , setShowPassword] = useState(false);
   const [formData , setFormData] = useState<LoginFormData>({
    email :"",
    password:"",
   })
  
   const handleInputChange = (name : string, value : string) =>{
     setFormData((prev) => ({
       ...prev,
       [name]:value
     }))
  }
  // console.log(formData)
  const handleFormSubmit = async (event : FormEvent<HTMLFormElement>) =>{
    event.preventDefault();
    try {
        const loginData = {
          email    : formData.email.toLowerCase().trim(),
          password : formData.password.trim(),
        }

        const result = await loginUserAction(loginData);
        console.log(result)

      if(result.status === "SUCCESS"){
        toast.success(result.message);
      }else{
        toast.error(result.message);
      }
    } catch (error) {}

   

  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-background'>
       <Card className='w-full max-w-md'>

          <CardHeader className='text-center'>
            <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4">
               <UserCheck className='text-primary-foreground w-8 h-8' />
            </div>
            <CardTitle >SignIn to Your Account</CardTitle>
            <CardDescription>
              Enter your details to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
             <form className='space-y-6' onSubmit={handleFormSubmit}>
                 {/* Email Field */}
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email Address *</Label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground'/>
                      <Input 
                        id='email' 
                        type='email' 
                        placeholder='Enter your email' 
                        required 
                        className='pl-10'
                        value={formData.email} 
                        onChange={(event : ChangeEvent<HTMLInputElement>) => handleInputChange("email" , event.target.value)}
                      />

                    </div>
                  </div>
                 
                 {/* PASSWORD */}
                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password*</Label>
                      <div className='relative'>
                        <Lock className="absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground " />
                        <Input
                          value={formData.password}
                          onChange={(event : ChangeEvent<HTMLInputElement>) => handleInputChange("password" , event.target.value) }
                            className='pl-10'
                            id="password" 
                            type= {showPassword ? "text" : "password"} 
                            placeholder="Enter your password" 
                            required />
                        <Button 
                          type='button'
                          variant="ghost"
                          size="sm"
                          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() => setShowPassword(!showPassword)}     
                          >
                          {
                            showPassword ? (
                              <EyeOff className='w-4 h-4 text-muted-foreground'/>
                            ) :(
                              <Eye className='w-4 h-4 text-muted-foreground'/>
                            )
                          }               
                        </Button>
                      </div>
                  </div>  

                    {/* SUBMIT  */}
                  <Button type="submit"  className='w-full'>
                      Sign In
                  </Button>

                 <div className='text-center'>
                    <p className='text-sm text-muted-foreground'>
                      New to Job Portal?  
                      <Link href="/register" className='text-primary hover:text-primary/80 font font-medium underline-offset-4 hover:underline'>Sign up here</Link>
                    </p>
                </div>
             </form>
          </CardContent>
       </Card>
    </div>
  )
}

export default Login