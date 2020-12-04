import React from "react";
import Button from "../../components/button";
import Card from "../../components/card";
import TextInput from "../../components/text-input";
import { auth } from "../../lib/firebase-client";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      window.location.href = "/admin";
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="mx-auto my-6 px-10 lg:max-w-5xl flex justify-center items-center h-screen">
      <Card wrapperclass="space-y-6 w-full max-w-sm">
        <h1 className="text-center text-2xl text-primary">Welcome Admin!</h1>
        <div>
          <label className="text-grey-600">Email Address</label>
          <TextInput
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="johndoe@email.com"
          />
        </div>
        <div>
          <label className="text-grey-600">Password</label>
          <TextInput
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="******"
          />
        </div>
        <Button className="w-full" onClick={handleLogin}>
          Login
        </Button>
        {showError && (
          <span className="text-red-500 text-center block m-0">
            {errorMessage}
          </span>
        )}
      </Card>
    </div>
  );
};

export default Login;
