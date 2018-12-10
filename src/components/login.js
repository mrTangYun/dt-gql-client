import {
  Form, Icon, Input, Button, Checkbox, message,
} from 'antd';
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const FormItem = Form.Item;

const MUTE_LOGIN = gql`
  mutation mutationLogin($userName: String!, $password: String!){
     login(userName: $userName, password: $password){
        token
        viewer{
          id
          userName
        }
      }
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


class NormalLoginForm extends Component {
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
          const { userName, password } = values;
          try {
            await this.props.loginHandler({
              variables: { userName, password },
            });
          } catch (e) {
            message.error('登陆失败');
          }
        }
      });
    };

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div id="components-form-demo-normal-login">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>Remember me</Checkbox>,
              )}
              <a className="login-form-forgot" href="">Forgot password</a>
              <Button disabled={this.props.loading} loading={this.props.loading} type="primary" htmlType="submit" className="login-form-button">
                            Log in
              </Button>
                        Or
              {' '}
              <a href="">register now!</a>
            </FormItem>
          </Form>
        </div>
      );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default () => (
  <Mutation
    mutation={MUTE_LOGIN}
    update={(cache, { data: { login }, loading }) => {
      // const oldData = cache.readQuery({ query: QUERY_LOGIN});
      const { viewer, token } = login;
      localStorage.setItem('token', token);
      cache.writeQuery({
        query: QUERY_LOGIN,
        data: {
          viewer,
        },
      });
    }}
  >
    {(login, { data, loading }) => (
      <WrappedNormalLoginForm loginHandler={login} loading={loading} />
    )}
  </Mutation>);
