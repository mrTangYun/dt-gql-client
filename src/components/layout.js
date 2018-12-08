import React  from 'react';
import { Layout, Menu, Icon } from 'antd';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const MUTE_LOGOUT = gql`
  mutation mutationLogout{
     logout
  }
`;
const QUERY_LOGIN = gql`
                  {
                      viewer{
                        id
                        userName
                      }
                    }
                `;

const {
    Header, Content, Footer, Sider,
} = Layout;

export default () => (
    <Layout>
        <Sider style={{
            overflow: 'auto', height: '100vh', position: 'fixed', left: 0,
        }}
        >
            <div className="logo" />
            <Mutation
                mutation={MUTE_LOGOUT}
                update={(cache, { data: { logout } }) => {
                    localStorage.removeItem('token');
                    cache.writeQuery({
                        query: QUERY_LOGIN,
                        data: {
                            viewer: null
                        }
                    });
                }}
            >
                {(muteLogout) => (
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['4']}
                        onClick={({ item, key, keyPath }) => {
                            if (key === 'logout') {
                                return muteLogout();
                            }
                        }}
                    >
                        <Menu.Item key="1">
                            <Icon type="user" />
                            <span className="nav-text">nav 1</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="video-camera" />
                            <span className="nav-text">nav 2</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="upload" />
                            <span className="nav-text">nav 3</span>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Icon type="bar-chart" />
                            <span className="nav-text">nav 4</span>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Icon type="cloud-o" />
                            <span className="nav-text">nav 5</span>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Icon type="appstore-o" />
                            <span className="nav-text">nav 6</span>
                        </Menu.Item>
                        <Menu.Item key="7">
                            <Icon type="team" />
                            <span className="nav-text">nav 7</span>
                        </Menu.Item>
                        <Menu.Item key="8">
                            <Icon type="setting" />
                            <span className="nav-text">设置</span>
                        </Menu.Item>

                        <Menu.Item key="logout">
                            <Icon type="logout" key={'icon'} />
                            <span className="nav-text" key={'text'}>退出</span>
                        </Menu.Item>
                    </Menu>
                    )}
            </Mutation>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
            <Header style={{ background: '#fff', padding: 0 }} />
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
                    ...
                    <br />
                    Really
                    <br />...<br />...<br />...<br />
                    long
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />
                    content
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                ©2018
            </Footer>
        </Layout>
    </Layout>
);