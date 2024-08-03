"use client";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, KeyOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import type { FormInstance } from "antd/lib/form";

interface LoginFormValues {
  loginId: string;
  password: string;
  accessCode: string;
}

const LoginPage = () => {
  const [form] = Form.useForm<FormInstance<LoginFormValues>>();

  const onFinish = (values: LoginFormValues) => {
    console.log("Received values of form: ", values);
    // Add your authentication logic here
    if (
      values.loginId === "your_correct_login_id" &&
      values.password === "your_correct_password" &&
      values.accessCode === "your_correct_access_code"
    ) {
      // Successful login
      message.success("Login successful");
    } else {
      // Incorrect login credentials
      message.error("Incorrect login credentials");
    }
  };

  useEffect(() => {
    // Set dark mode class based on user preference
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.classList.add(prefersDarkMode ? "dark" : "light");
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <Form
        form={form}
        name="login-form"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="loginId"
          rules={[{ required: true, message: "Please enter your Login ID!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Login ID" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your Password!" }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="accessCode"
          rules={[
            { required: true, message: "Please enter your Access Code!" },
          ]}
        >
          <Input
            prefix={<KeyOutlined />}
            type="password"
            placeholder="Access Code"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
