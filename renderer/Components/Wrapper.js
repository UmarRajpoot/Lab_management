import {
  DashboardFilled,
  FileDoneOutlined,
  FileMarkdownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { useRouter } from "next/router";
import React from "react";
const { Header, Content, Footer, Sider } = Layout;
const Wrapper = ({ children }) => {
  const router = useRouter();

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" style={{ height: "60px" }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={[
            {
              key: 1,
              icon: React.createElement(DashboardFilled),
              label: `Dashboard`,
              onClick: () => {
                router.push("/home");
              },
            },
            {
              key: 2,
              icon: React.createElement(FileDoneOutlined),
              label: `Assignment`,
              onClick: () => {
                router.push("/Assignment");
              },
            },
            {
              key: 3,
              icon: React.createElement(FileMarkdownOutlined),
              label: `Quiz`,
              onClick: () => {
                router.push("/Quiz");
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
          }}
        />
        <Content
          style={{
            margin: "24px 16px 0",
            minHeight: "100vh",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          CopyRight ©2023
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Wrapper;
