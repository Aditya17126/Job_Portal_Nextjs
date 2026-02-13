"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from 'lucide-react';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import registrationAction from '@/features/auth/server/auth.action';
import { toast } from 'sonner';

// interface RegistrationFormData {
//   name :string;
//   userName : string;
//   email : string;
//   password : string;
//   confirmPassword : string;
//   role : 'applicant'| 'employer';
// }

const Registration : React.FC = () => {
  const [showPassword , setShowPassword] = useState(false);
  const [showConfirmPassword , setShowConfirmPassword] = useState(false);
  const {
    register ,
    handleSubmit,
    watch ,
    formState:{errors},
  } = useForm<Inputs>();
  
  // const handleInputChange = (name : string, value : string) =>{
  //    setFormData((prev) => ({
  //      ...prev,
  //      [name]:value
  //    }))
  // }
  // console.log(formData);
 
  const handleSubmit = async (event : FormEvent<HTMLFormElement>) =>{
    event.preventDefault();

     const result =  await registrationAction(registrationData);
       
      if(result.status === 'SUCCESS') toast.success(result.message);
       else toast.error(result.message);
     
  }


  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
       <Card className='w-full max-w-md' >
          
         <CardHeader className='text-center'>
           <div className='mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4'>
              <UserCheck className='text-primary-foreground w-8 h-8 '/>
           </div>
            <CardTitle className='text-2xl'> Join Our Job Portal</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
         </CardHeader>

          <CardContent>
             <form onSubmit={handleSubmit} className='space-y-6'>
             
               {/* Email Field */}
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address *</Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground'/>
                    <Input 
                      id='email' 
                      name='email'
                      type='email' 
                      placeholder='Enter your email' 
                      required 
                      {...register('email')}
                      className='pl-10'
                    />

                  </div>
                </div>
             
               {/* NAME FIELD */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      name="name"
                      type="text" 
                      placeholder="Enter your full name" 
                      required 
                      {...register('name')}
                      className="pl-10 pt-3 pb-3"
                    /> 
                  </div>
                </div>
               

                {/* UserName Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Username* </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                     name="userName"
                      id="userName" 
                      type="text" 
                      placeholder="Choose a username" 
                      required 
                      {...register('userName')}
                      className="pl-10 pt-3 pb-3"
                    /> 
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="name">I am a*</Label>
                  <Select 
                    name="role"
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select your role"/>  
                    </SelectTrigger>
                    <SelectContent>
                          {/* <SelectLabel>Select your role</SelectLabel> */}
                          <SelectItem value="applicant">Job Applicant</SelectItem>
                          <SelectItem value="employer">Employer</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
               
               {/* PASSWORD */}
                <div className='space-y-2'>
                  <Label htmlFor='password'>Password*</Label>
                    <div className='relative'>
                      <Lock className="absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground " />
                      <Input
                        name="password"
                          className='pl-10'
                          id="password" 
                          type={showPassword ? "text" : "password"} 
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
              
                  {/* CONFRIM PASSWORD */}
                <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>Confirm Password*</Label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-2.5 text-muted-foreground w-4 h-4 transform-translate-y-1/2'/>
                      <Input
                        name="confirmPassword"
                        id="comfirmPassword" 
                        type={showConfirmPassword ? "text" : "password" }
                        placeholder="Confirm your password" 
                        required 
                        className='pl-10'/>
                      <Button type="button" variant="ghost" size='sm' className='absolute right-0 top-0 text-muted-foreground h-full px-3 py-2 hover:bg-transparent' 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {
                          showConfirmPassword ? (
                            <EyeOff className='w-4 h-4 text-muted-foreground'/>
                          ) : (
                            <Eye className='w-4 h-4 text-muted-foreground'/>
                          )
                        }
                      </Button>
                    </div>
                </div>

                {/* SUBMIT  */}
                <Button type="submit"  className='w-full'>
                    Create Account
                </Button>
               
                <div className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  Already have an account ?  
                  <Link href="/login" className='text-primary hover:text-primary/80 font font-medium underline-offset-4 hover:underline'>Sign in here</Link>
                </p>
                </div>

             </form>

          </CardContent>
       
       </Card>
    </div>
  )
}

export default Registration
