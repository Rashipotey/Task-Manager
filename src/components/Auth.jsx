import { useDispatch } from "react-redux"
import { setUser, setLoading, setError } from "../redux/authSlice"
import { googleSignIn, emailSignIn, emailSignUp } from "../services/authServices"
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import GoogleIcon from "@mui/icons-material/Google"

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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
      }}
    >
      <Card
        sx={{
          width: { xs: "90%", sm: "400px" },
          boxShadow: 3,
          borderRadius: 3,
          padding: 3,
          backgroundColor: "#fff",
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            {isSignUp ? "Create an Account" : "Welcome Back!"}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEmailAuth}
              sx={{
                mt: 1,
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
                ":hover": {
                  backgroundColor: "#1e88e5",
                },
              }}
            >
              {isSignUp ? "Sign Up" : "Login"}
            </Button>

            <IconButton
              onClick={handleGoogleSignIn}
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                mt: 1,
                py: 1.2,
                ":hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <GoogleIcon sx={{ color: "#DB4437", mr: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Sign in with Google
              </Typography>
            </IconButton>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              textAlign: "center",
              cursor: "pointer",
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Auth
