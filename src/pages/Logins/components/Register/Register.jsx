import { useRef, useState, useEffect } from "react";
import { Button, FormControlLabel, Checkbox } from "@mui/material";
import { Form } from "react-bootstrap";
import styles from "../../../../style/Register.module.css";

function Register() {
  // const userRef = useRef();
  // const errRef = useEffect();

  // const [user, setUser] = useState("");
  // const [pwd, setPass] = useState("");
  // const [errMsg, setErrMsg] = useState("");
  // const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

  // useEffect(() => {
  //   setErrMsg("");
  // }, [user, pwd]);

  return (
    <form className={styles.groupForm}>
      <div className={styles.rectangleDiv} />
      <Button
        className={styles.groupButton}
        sx={{ width: 403.7789306640625 }}
        variant="contained"
        color="primary"
      >
        Đăng Nhập
      </Button>
      <FormControlLabel
        className={styles.groupFormControlLabel}
        label="Duy trì đăng nhập"
        labelPlacement="end"
        control={<Checkbox color="primary" size="medium" />}
      />
      <div className={styles.groupDiv}>
        <div className={styles.nhaKhoaCHnh}> Nha Khoa Đức Hạnh</div>
        <div className={styles.ngNhpVoHThng}>Đăng nhập vào hệ thống</div>
      </div>
      <Form.Group className={styles.groupFormGroup}>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className={styles.groupFormGroup1}>
        <Form.Control
          type="text"
          placeholder="Staff ID"
          id="username"
          // ref={userRef}
          // autoComplete="off"
          // onchange={(e) => setUser(e.target.value)}
          // value={user}
        />
      </Form.Group>
    </form>
  );
}

export default Register;