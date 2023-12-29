import { auth } from "../providers/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Flex } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

const StagingGate = () => {
  // @ts-ignore
  const [user] = useAuthState(auth);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error", error);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      className="xhub-w-full xhub-h-full"
      vertical
    >
      <p>
        To access your staging area, please sign in with your Google account.
      </p>
      <Button
        type="primary"
        onClick={handleGoogleLogin}
        style={{ color: "black" }}
      >
        <GoogleOutlined />
        Sign In with Google
      </Button>
    </Flex>
  );
};

export default StagingGate;
