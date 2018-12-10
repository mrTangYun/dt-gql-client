import React  from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Spin } from 'antd';
import moment from 'moment';
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from "bizcharts";


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
            const scale = {
                trade_date: {
                    type: "time",
                    tickCount: 15,
                    mask: "YYYY-MM-dd"
                },
                flow: {
                    alias: "流量(m^3/s)"
                },
                rain: {
                    alias: "降雨量(mm)"
                }
            };
            return <div>
                <Chart
                    height={400}
                    data={_data}
                    forceFit
                    scale={scale}
                >
                    <Axis name="trade_date"  />
                    <Axis name="change" />
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="line" position="trade_date*change" size={2} />
                    <Geom
                        type="point"
                        position="trade_date*change"
                        size={4}
                        shape={"circle"}
                        style={{
                            stroke: "#fff",
                            lineWidth: 1
                        }}
                    />
                </Chart>
            </div>;
        }}
    </Query>
);

export default PageComponent;