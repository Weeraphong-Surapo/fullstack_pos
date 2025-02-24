import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ReportPerDay = ({ orderPerDays }) => {
    // แปลงข้อมูลให้อยู่ในรูปแบบที่ ApexCharts ต้องการ
    const categories = orderPerDays.map(item => new Date(item.order_date).toLocaleDateString());
    const seriesData = orderPerDays.map(item => parseFloat(item.total_price_per_day)); // แปลงเป็นตัวเลข

    const [state, setState] = React.useState({
        series: [{
            name: 'รายได้ต่อวัน',
            data: seriesData
        }],
        options: {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'รายได้ต่อวัน',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: categories, // ใช้วันที่แทน
                title: {
                    text: 'วันที่'
                }
            },
            yaxis: {
                title: {
                    text: 'รายได้ (บาท)'
                }
            }
        }
    });

    return (
        <div className='card border-0 shadow mt-3'>
            <div className="card-body">
                <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
            </div>
        </div>
    );
}

export default ReportPerDay;
