"use client"
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'

interface FormDataType{
    name : string,
    userName : string,
    email : string,
    password : string,
    confirmPassword : string,
    phoneNo: string,
    role : "applicant" | "employer"
}

const TestingRegistration = () => {
    const [formData , setFormData] = useState<FormDataType>({
        name :"",
        userName : "",
        email :"",
        password : "",
        confirmPassword : "",
        phoneNo: "",
        role : "applicant"
    })


  return (
    <Card>
        <CardHeader className='w-full max-w-s'>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription >
        </CardHeader>
    </Card>
  )
}

export default TestingRegistration