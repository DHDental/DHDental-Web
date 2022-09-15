import Register from "./components/Register/Register";
import Background from "./components/Background/Background";
import styles from "../../style/WelcomloginFrame.module.css";

const WelcomloginFrame = () => {
    return (
      <div className={styles.welcomloginFrameDiv}>
        <Background />
        <Register />
      </div>
    );
  };
  
  export default WelcomloginFrame;