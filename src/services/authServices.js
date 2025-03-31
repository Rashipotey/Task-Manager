import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../firebase"

export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export const emailSignIn = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export const emailSignUp = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}

export const logoutUser = async () => {
  await signOut(auth)
}
