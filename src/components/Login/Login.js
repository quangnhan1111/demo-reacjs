import React, { useContext, useState } from 'react'
import Api from "../../Config/config"
import {useGlobalContext} from "../../context/LoginContext"
import {Button, Form} from "react-bootstrap";
export default function Login() {
    // const [userInput , setuserInput] = useState({username:"", password:""});
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState(null);
    // const { LoginDispatch } = useContext(LoginContext);
    const { LoginDispatch } = useGlobalContext()
    const OnSubmitHandle =  (e) =>{
        e.preventDefault();
        if( username === ""  || password === "") {
            setErrorMessage("You have not entered username or password")
        }else{
            const userInput = { username, password };
            console.log(userInput);
            Api.post("auth/login", userInput).then((response)=> {
                setErrorMessage(null);
                console.log(response.data)
                const {token, info} = response.data;
                if(response.data.info.roleNames[0] === "admin" || response.data.info.roleNames[0] === "employee"){
                    localStorage.setItem("token", token);
                    localStorage.setItem("id", info.id);
                    localStorage.setItem("username", info.username);
                    localStorage.setItem("fullname", info.fullName);
                    localStorage.setItem("roleNames", info.roleNames);
                    setErrorMessage("")
                    LoginDispatch();
                }else{
                    setErrorMessage("acount is not exist")
                }

            }).catch((error) =>{
                setErrorMessage( "username or password is not correct" );
            });
        }

    }
    const handleKeypress = e => {
        //it triggers by pressing the enter key
        if (e.charCode === 13) {
            OnSubmitHandle();
        }
    };

    return (
        <div className="login">
            <div className="login-form">
                <h3>Login</h3>
                <div className="row">
                    <h3>Username:</h3>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onKeyPress={handleKeypress}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <br></br>
                </div>
                <div className="row">
                    <h3>Password :</h3>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        name="password"
                        onKeyPress={handleKeypress}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br></br>
                </div>
                <input type="button" value="Login" className="login-button"
                       onClick={OnSubmitHandle}/>
                <br></br>
                {errorMessage && (
                    <div className="error-mesage"><h3>{errorMessage}</h3></div>
                )}
            </div>

        </div>



    )
}
