import React  from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Spin, Select } from 'antd';
import moment from 'moment';
import echarts from 'echarts';

const Option = Select.Option;

class EchartComponent extends React.Component{
    componentWillReceiveProps(nextProps) {
        if (this.props.ts_code === nextProps.data.ts_code) return false;
        this.myChart.setOption({
            xAxis: {
                data: nextProps.data.map(({trade_date}) => (trade_date))
            },
            series: [{
                data: nextProps.data.map(({change}) => (change))
            }]
        });
    }
    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(this.el);
        // 绘制图表
        this.myChart.setOption({
            title: {
                text: '周涨跌额'
            },
            tooltip: {},
            xAxis: {
                data: this.props.data.map(({trade_date}) => (trade_date))
            },
            dataZoom: [
                {   // 这个dataZoom组件，默认控制x轴。
                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                    start: 96,      // 左边在 10% 的位置。
                    end: 100         // 右边在 60% 的位置。
                },
                {
                    type: 'inside'
                }
            ],
            yAxis: {},
            series: [{
                name: '涨跌幅',
                type: 'line',
                data: this.props.data.map(({change}) => (change)),
                smooth: true
            }]
        });
    }

    componentWillUnmount() {
        this.myChart && this.myChart.dispose();
    }
    render () {
        return (<div ref={node => {
            this.el = node;
        }} style={{
            height: '400px'
        }} />);
    }
}

const EchartComponentWithData = ({ts_code}) => (
    <Query
        variables={{
            ts_code
        }}
        query={
            gql`
               query queryWeekly($ts_code: String) {
                  tuShare {
                    weekly(ts_code: $ts_code) {
                      change
                      trade_date
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
                trade_date: moment(trade_date, 'YYYYMMDD').format('YYYY年MM-DD')
            })).filter(({change}) => change);
            return <EchartComponent ts_code={ts_code} data={_data}/>;
        }}
    </Query>
);

class PageComponent extends React.Component{
    state = {};
    handleChangeStock = value => {
        this.setState({
            currentStock: value
        });
    };
    render() {
        return (<Query
            query={
                gql`
                   query queryWeekly {
                      tuShare {
                        stock_basic {
                          id
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
                const {tuShare: {stock_basic}} = data;
                return <div>
                    <Select defaultValue={stock_basic[0].name} style={{ width: 120 }} onChange={this.handleChangeStock}>
                        {
                            stock_basic.slice(0, 500).map(({id, ts_code, name}) => (<Option key={ts_code} value={ts_code}>{name}</Option>))
                        }
                    </Select>
                    <EchartComponentWithData ts_code={this.state.currentStock || stock_basic[0].ts_code} />
                </div>;
            }}
        </Query>)
    }
}

export default PageComponent;