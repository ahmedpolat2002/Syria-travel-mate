import SignUpForm from "../../components/SignUpForm/SignUpForm";
import Styles from "./SignUpPage.module.css";

function LoginPage() {
  return (
    <div className={Styles.container}>
      <SignUpForm />
    </div>
  );
}

export default LoginPage;
