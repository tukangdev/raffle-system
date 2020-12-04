import React from "react";
import Button from "../../components/button";
import Card from "../../components/card";
import TextInput from "../../components/text-input";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  return (
    <div className="mx-auto my-6 px-10 lg:max-w-5xl flex justify-center items-center h-screen">
      <Card wrapperClass="space-y-6">
        <h1 className="text-center text-2xl text-primary">Welcome Admin!</h1>
        <div>
          <label className="text-grey-600">Email Address</label>
          <TextInput
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
        <span className="text-red-500 text-center block m-0">
          Wrong email or password!
        </span>
      </Card>
    </div>
  );
};

export default Login;
