import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoginUserData, loginUserSchema } from '@/features/auth/auth.schema'
import { loginUserAction } from '@/features/auth/server/auth.action'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail, UserCheck } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'


const Login = () => {
   const [showPassword , setShowPassword] = useState(false);
   const {register , handleSubmit ,formState : {errors} } = useForm({
    resolver : zodResolver(loginUserSchema)
   }) 

  const onSubmit = async (data : LoginUserData) =>{
    try {
       
        const result = await loginUserAction(data);
        console.log(result)

        if(result.status === "SUCCESS"){
          toast.success(result.message);
        }else{
          toast.error(result.message);
        }
    } catch (error) {
      toast.error("Something went wrong");
    }
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
             <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
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
                        className={`pl-10 ${  errors.email ? "border-destructive":""}`}
                        {...register("email")}
                      />
                    </div>
                     {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
                  </div>
                 
                 {/* PASSWORD */}
                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password*</Label>
                      <div className='relative'>
                        <Lock className="absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground " />
                        <Input
                          className={`pl-10 ${  errors.password ? "border-destructive":""}`}
                          id="password" 
                          type= {showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          required 
                          {...register("password")}
                        />
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