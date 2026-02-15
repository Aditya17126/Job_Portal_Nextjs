"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import registrationAction from "@/features/auth/server/auth.action";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { RegisterUserWithConfirmData, registerUserWithConfirmSchema } from "@/features/auth/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const Registration: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserWithConfirmSchema)
  });

  const onSubmit = async (data: RegisterUserWithConfirmData) => {
    try {
      setLoading(true);
      const result = await registrationAction(data);

      if (result.status === "SUCCESS") toast.success(result.message);
      else toast.error(result.message);

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }

  };

  console.log("Inside the regist", errors);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserCheck className="text-primary-foreground w-8 h-8 " />
          </div>
          <CardTitle className="text-2xl"> Join Our Job Portal</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  {...register("email")}
                  className="pl-10"
                />
              </div>
              {errors.email && (<p className="text-sm text-destructive">{errors.email.message}</p>)}
            </div>

            {/* NAME FIELD */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  {...register("name")}
                  className="pl-10 pt-3 pb-3"
                />
              </div>
              {errors.name && (<p className="text-sm text-destructive">{errors.name.message}</p>)}
            </div>

            {/* UserName Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Username* </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="userName"
                  type="text"
                  placeholder="Choose a username"
                  required
                  {...register("userName")}
                  className="pl-10 pt-3 pb-3"
                />
              </div>
              {errors.userName && <p className="text-sm text-destructive">{errors.userName.message}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="name">I am a*</Label>
              <Controller name="role" control={control} render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applicant">Applicant</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                  </SelectContent>
                </Select>
              )}>

              </Controller>
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 transform-translate-y-1/2 w-4 h-4 text-muted-foreground " />
                <Input
                  className="pl-10"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            {/* CONFRIM PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password*</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4 transform-translate-y-1/2" />
                <Input
                  id="comfirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  {...register("confirmPassword")}
                  className="pl-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 text-muted-foreground h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            {/* SUBMIT  */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account ?
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font font-medium underline-offset-4 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registration;
