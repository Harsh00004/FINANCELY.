import React, { useState } from 'react';
import "./styles.css";
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from '../../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignupSigninComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginForm, setLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function signupWithEmail(e) {
        e.preventDefault();
        setLoading(true);

        if (name && email && password && confirmPassword) {
            if (password === confirmPassword) {
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    toast.success("User Created!");
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    await createDoc(user);
                    navigate("/dashboard");
                } catch (error) {
                    toast.error(error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                toast.error("Password and Confirm Password don't match!");
                setLoading(false);
            }
        } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    async function loginUsingEmail(e) {
        e.preventDefault();
        setLoading(true);

        if (email && password) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                toast.success("User Logged In!");
                navigate("/dashboard");
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    async function createDoc(user) {
        setLoading(true);
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);
        if (!userData.exists()) {
            const { displayName, email, photoURL } = user;
            const createdAt = new Date();
            try {
                await setDoc(userRef, {
                    name: displayName || name || "Anonymous",
                    email: email,
                    photoURL: photoURL || "",
                    createdAt,
                });
                toast.success("Doc created!");
            } catch (e) {
                toast.error(e.message);
            }
        } else {
            toast.error("Doc already exists");
        }
        setLoading(false);
    }

    async function googleAuth() {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            toast.success("User authenticated!");
            await createDoc(user);
            navigate("/dashboard");
        } catch (error) {
            toast.error(`Authentication failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>  
            {loginForm ? (
                <div className="signup-wrapper">
                    <h2 className="title">
                        Login on <span style={{ color: 'blue' }}>Financely.</span>
                    </h2>
                    <form>
                        <div className="form-group">
                            <Input
                                state={email}
                                setState={setEmail} 
                                placeholder={"Email"}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                type="password"
                                state={password}
                                setState={setPassword} 
                                placeholder={"Password"}
                            />
                        </div>
                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Login Using Email and Password"} 
                            onClick={loginUsingEmail}
                        />
                        <p className='p-login'>or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Login Using Google"} 
                            blue={true} 
                        />
                        <p
                            className="p-login"
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(false)}>
                            Don't Have An Account? Click Here.
                        </p>
                    </form>
                </div>
            ) : (
                <div className="signup-wrapper">
                    <h2 className="title">
                        Sign Up on <span style={{ color: 'blue' }}>Financely.</span>
                    </h2>
                    <form>
                        <div className="form-group">
                            <Input
                                state={name}
                                setState={setName} 
                                placeholder={"Full Name"}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                state={email}
                                setState={setEmail} 
                                placeholder={"Email"}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                type="password" 
                                state={password}
                                setState={setPassword} 
                                placeholder={"Password"}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                type="password"
                                state={confirmPassword}
                                setState={setConfirmPassword} 
                                placeholder={"Confirm Password"}
                            />
                        </div>
                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Signup Using Email and Password"} 
                            onClick={signupWithEmail}
                        />
                        <p className="p-login">or</p>
                        <Button 
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Signup Using Google"} 
                            blue={true} 
                        />
                        <p
                            className="p-login"
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(true)}>
                            Already Have An Account? Click Here.
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}

export default SignupSigninComponent;
