// AdminLogin.js
import { useState } from "react"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  const { error, loading, handleLogin } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin(credentials)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 ">
      <div className="card w-full max-w-md  bg-base-100 border-t-6 shadow-md border-primary">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center mb-6 text-primary">Admin Login</h2>
          {error && (
            <div className="alert alert-error mb-6">
              <AlertCircle className="w-6 h-6" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="input input-bordered border-primary focus:outline-none w-full pl-10"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="input input-bordered border-primary focus:outline-none w-full pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className={`btn btn-primary w-full ${loading ? "loading" : ""}`} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link to="/register" className="text-sm text-gray-500 hover:text-gray-700">
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
