import React  from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Spin } from 'antd';
import moment from 'moment';

const PageComponent = () => (
    <Query
        query={
            gql`
               query queryWeekly {
                  tuShare {
                    weekly(ts_code: "000001.SZ") {
                      id
                      change
                      trade_date
                      high
                      low
                      amount
                      vol
                    }
                    stock_basic {
                      ts_code
                      name
                    }
                  }
                }
            `
        }
    >
        {({ loading, error, data }) => {
            if (loading) return <div className={'App'}><Spin size="large"/></div>;
            if (error) return <div className={'App'}><p>Error :(</p></div>;
            const {tuShare: {weekly}} = data;
            const _data = weekly.reverse().map(({change, trade_date}) => ({
                change,
                trade_date: moment(trade_date, 'YYYYMMDD').toDate()
            }));
            console.log(_data);
            return <div>

            </div>;
        }}
    </Query>
);

export default PageComponent;