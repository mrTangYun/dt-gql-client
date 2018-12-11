import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Spin, Select } from 'antd';
import moment from 'moment';
import echarts from 'echarts';


class EchartComponent extends React.Component {

    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(this.el);

        // data: [['2015/11/08',10,'DQ'],['2015/11/09',15,'DQ']]
        const data = [];
        this.props.data.titles.map((title, title_index) => {
            this.props.data.dates.map((date, date_index) => {
                const data_ = this.props.data.data[date_index][title_index];
                data.push([moment(date, 'YYYY.MM.DD').format('YYYY/MM/DD'), data_, title]);
            });
        });

        // 绘制图表
        this.myChart.setOption({
            title: {
                text: 'csv数据',
            },
            singleAxis: {
                top: 50,
                bottom: 50,
                axisTick: {},
                axisLabel: {},
                type: 'time',
                axisPointer: {
                    animation: true,
                    label: {
                        show: true
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        opacity: 0.2
                    }
                }
            },
            legend: {
                data: this.props.data.titles
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(0,0,0,0.2)',
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            series: [
                {
                    type: 'themeRiver',
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.8)'
                        }
                    },
                    data
                }
            ],
            dataZoom: [
                // { // 这个dataZoom组件，默认控制x轴。
                //     type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                //     start: 96, // 左边在 10% 的位置。
                //     end: 100, // 右边在 60% 的位置。
                // },
                // {
                //     type: 'inside',
                // },
            ],
        });
    }

    componentWillUnmount() {
        this.myChart && this.myChart.dispose();
    }

    render() {
        return (
            <div
                ref={(node) => {
                    this.el = node;
                }}
                style={{
                    height: '400px',
                }}
            />
        );
    }
}

export default () => (
    <Query
        query={
            gql`
               query queryCSV {
                  tuShare {
                    getCSVData {
                        titles
                        dates
                        data
                    }
                  }
                }
            `
        }
    >
        {({ loading, error, data }) => {
            if (loading) return <Spin size="large" />;
            if (error) return <div><p>Error :(</p></div>;
            const { tuShare: { getCSVData } } = data;
            return (
                <EchartComponent data={getCSVData} />
            );
        }}
    </Query>
);