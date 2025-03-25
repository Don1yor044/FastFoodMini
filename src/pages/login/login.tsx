import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Row,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import axios from "axios";

export const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async () => {
    try {
      const res = await axios.post("https://80a4e112872cbb1a.mokky.dev/auth", {
        username: form.getFieldValue("username"),
        password: form.getFieldValue("password"),
      });
      console.log(res);
      localStorage.setItem("userId", res.data.data.id);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.data.username);
      localStorage.setItem("phone", res.data.data.phone);
      localStorage.setItem("fullname", res.data.data.fullname);
      message.success("Xush kelibsiz!");
      if (res.status === 201) navigate("/home");
    } catch (error) {
      console.error(error);
      message.error("Username yoki parol xato!");
    }
  };

  return (
    <div
      className="bg-[#FFAB08] p-5"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="flex">
        <div
          className="bg-white p-4 text-center"
          style={{
            height: "500px",
            width: "500px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="mt-16">
            <Typography.Title level={2}>Login</Typography.Title>
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              style={{ width: "100%" }}
            >
              <Row gutter={16}>
                <Col span={22} offset={1}>
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: "user name kiriting!" }]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="Name" css={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={22} offset={1}>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: "parolni kiriting!" }]}
                    style={{ margin: 0 }}
                  >
                    <Input.Password placeholder="Password" css={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button
                      className="rounded-2xl px-16 bg-[#FFAB08] text-white mt-10 text-center"
                      type="primary"
                      htmlType="submit"
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div className="flex justify-between mt-10 px-5">
              <Button
                type="link"
                onClick={() => navigate("/home")}
                style={{ padding: 0, color: "#FFAB08" }}
              >
                Later
              </Button>
              <Button
                type="link"
                onClick={() => {
                  navigate("/register");
                }}
                style={{ padding: 0, color: "#FFAB08" }}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Image
            src="https://png.pngtree.com/png-clipart/20231003/original/pngtree-tasty-burger-png-ai-generative-png-image_13245897.png"
            css={css`
              object-fit: cover;
              height: 500px !important;
              width: 500px !important;
              border-radius: 0px 10px 10px 0px;
            `}
          />
        </div>
      </div>
    </div>
  );
};

const inputStyle = css`
  border: none;
  outline: none;
  border-bottom: 2px solid gray;
  border-radius: 5px 5px 0px 0px;
  box-shadow: none;
  margin-top: 30px;
  transition: border-bottom-color 0.3s ease;
  width: 100%;

  &:focus {
    border-bottom: 2px solid #ffab08;
  }
  &:hover {
    border-bottom: 2px solid #ffab08 !important;
  }
`;
