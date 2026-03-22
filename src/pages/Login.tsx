// src/pages/Login.tsx
import { AtSign, Eye, EyeOff, Lock, Mail } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { Toaster, toast } from "react-hot-toast"

const Login = () => {
  const [state, setState] = useState('login') // start with login
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login: loginUser, signup: signupUser, user } = useAppContext();

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const toggleState = () => {
    setState(prev => prev === 'login' ? 'signup' : 'login')
    setError('')
    setUsername('')
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (state === 'login') {
        const res: any = await loginUser({ email, password })
        if (res?.error) {
          throw new Error(res.error)
        }
        toast.success("Logged in successfully!")
      } else {
        const res: any = await signupUser({ username, email, password })
        if (res?.error) {
          throw new Error(res.error)
        }
        toast.success("Account created successfully!")
        // signupUser already sets the user state, which triggers redirect
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Toaster />
      <main className="login-page-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
            {state === 'login' ? "Sign in" : "Sign up"}
          </h2>
          <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">
            {state === 'login' 
              ? 'Please enter Email and Password to access.' 
              : 'Please enter your details to create an account.'}
          </p>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* Username input for signup only */}
          {state === 'signup' && (
            <div className="relative mt-4">
              <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Username</label>
              <div className="relative mt-2">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5"/>
                <input
                  onChange={(e)=>setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Enter your username"
                  className="login-input"
                  required
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="relative mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Email</label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5"/>
              <input
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Enter your email"
                className="login-input"
                required
              />
            </div>  
          </div>

          {/* Password input */}
          <div className="relative mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5"/>
              <input 
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
                className="login-input pr-10"
                required
                type={showPassword ? 'text' : 'password'}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={()=> setShowPassword((p)=> !p)}
              >
                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>  
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="login-button mt-4"
          >
            {isSubmitting ? "Submitting..." : state === "login" ? 'Login' : 'Sign up'}
          </button>

          {state === 'login' && (
            <button
              type="button"
              className="w-full mt-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => {
                setEmail('demo@example.com');
                setPassword('password123');
              }}
            >
              Use Demo Account
            </button>
          )}

          {/* Toggle links */}
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {state === 'login' 
              ? <>Don't have an account? <button type="button" className="text-blue-500" onClick={toggleState}>Sign up</button></>
              : <>Already have an account? <button type="button" className="text-blue-500" onClick={toggleState}>Login</button></>
            }
          </p>

        </form>
      </main>
    </div>
  )
}

export default Login