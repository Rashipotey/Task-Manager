import { useDispatch } from "react-redux"
import { setUser, setLoading, setError } from "../redux/authSlice"
import { googleSignIn, emailSignIn, emailSignUp } from "../services/authServices"
import { Button, TextField, Box, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const serializeUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }
}

function Auth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      dispatch(setLoading(true))
      const user = await googleSignIn()
      dispatch(setUser(serializeUser(user)))
      navigate("/")
    } catch (error) {
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleEmailAuth = async () => {
    try {
      dispatch(setLoading(true))
      let user
      if (isSignUp) {
        user = await emailSignUp(email, password)
      } else {
        user = await emailSignIn(email, password)
      }
      dispatch(setUser(serializeUser(user)))
      navigate("/")
    } catch (error) {
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <Box sx={{ mt: 3, textAlign: "center" }}>
      <Typography variant="h5">{isSignUp ? "Sign Up" : "Login"}</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2, alignItems: "center" }}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: "75%", mx: "auto" }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: "75%", mx: "auto" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleEmailAuth}
          sx={{ width: "75%", mx: "auto" }}
        >
          {isSignUp ? "Sign Up" : "Login"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleGoogleSignIn}
          sx={{ width: "75%", mx: "auto" }}
        >
          Sign in with Google
        </Button>
        <Typography
          variant="body2"
          sx={{ cursor: "pointer", mt: 1 }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </Typography>
      </Box>
    </Box>
  )
}

export default Auth
