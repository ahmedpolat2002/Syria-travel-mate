import LoginForm from "../../components/LoginForm/LoginForm";
import Styles from "./LoginPage.module.css";

function LoginPage() {
  return (
    <div className={Styles.container}>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
