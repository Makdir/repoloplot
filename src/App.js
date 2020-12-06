import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Button';
import Button from 'react-bootstrap/Button';


import request from 'superagent';
import Plot from 'react-plotly.js';

import Header from './components/Header.js';
import DatesRangePicker from './components/DatesRangePicker.js';

class App extends React.Component {



  constructor(props) {
    super(props);

    let x_data = ['2017-01-04', '2017-01-05', '2017-01-06', '2017-01-09', '2017-01-10', '2017-01-11', '2017-01-12', '2017-01-13', '2017-01-17', '2017-01-18', '2017-01-19', '2017-01-20', '2017-01-23', '2017-01-24', '2017-01-25', '2017-01-26', '2017-01-27', '2017-01-30', '2017-01-31', '2017-02-01', '2017-02-02', '2017-02-03', '2017-02-06', '2017-02-07', '2017-02-08', '2017-02-09', '2017-02-10', '2017-02-13', '2017-02-14', '2017-02-15'];
    
    this.yaxis1 = {
      autorange: true,
      domain: [0.21, 1],
      type: 'linear'
    } 

    this.yaxis2 = {
      autorange: true,
      domain: [0, 0.2],
      type: 'linear'
    } 

    this.state = {
      startDate: new Date() - 7*24*60*60*1000,
      endDate: new Date(),

      data: [

        {
          x: x_data,
          close: [116.019997, 116.610001, 117.910004, 118.989998, 119.110001, 119.75, 119.25, 119.040001, 120, 119.989998, 119.779999, 120, 120.080002, 119.970001, 121.879997, 121.940002, 121.949997, 121.629997, 121.349998, 128.75, 128.529999, 129.080002, 130.289993, 131.529999, 132.039993, 132.419998, 132.119995, 133.289993, 135.020004, 135.509995], 
          high: [116.510002, 116.860001, 118.160004, 119.43, 119.379997, 119.93, 119.300003, 119.620003, 120.239998, 120.5, 120.089996, 120.449997, 120.809998, 120.099998, 122.099998, 122.440002, 122.349998, 121.629997, 121.389999, 130.490005, 129.389999, 129.190002, 130.5, 132.089996, 132.220001, 132.449997, 132.940002, 133.820007, 135.089996, 136.270004], 
          low: [115.75, 115.809998, 116.470001, 117.940002, 118.300003, 118.599998, 118.209999, 118.809998, 118.220001, 119.709999, 119.370003, 119.730003, 119.769997, 119.5, 120.279999, 121.599998, 121.599998, 120.660004, 120.620003, 127.010002, 127.779999, 128.160004, 128.899994, 130.449997, 131.220001, 131.119995, 132.050003, 132.75, 133.25, 134.619995], 
          open: [115.849998, 115.919998, 116.779999, 117.949997, 118.769997, 118.739998, 118.900002, 119.110001, 118.339996, 120, 119.400002, 120.449997, 120, 119.550003, 120.419998, 121.669998, 122.139999, 120.93, 121.150002, 127.029999, 127.980003, 128.309998, 129.130005, 130.539993, 131.350006, 131.649994, 132.460007, 133.080002, 133.470001, 135.520004], 
         
          type: "candlestick",

          name: "scatter",
          xaxis: 'x', 
          yaxis: 'y'

        },

        { type: "bar", 
          name: "volume", 
          yaxis: 'y2',
          x: x_data, 
          y: [2, 5, 3] 
        },


      ],

      layout: { 
        dragmode: 'zoom', 
        margin: {
          r: 10, 
          t: 25, 
          b: 40, 
          l: 60
        }, 
        showlegend: false, 
        xaxis: {
          autorange: true, 
          //domain: [0, 1], 
          range: ['2017-01-03 12:00', '2017-02-15 12:00'], 
          rangeslider: {range: ['2017-01-03 12:00', '2017-02-15 12:00']}, 

          title: 'Date', 
          type: 'date'
        }, 
        yaxis: this.yaxis1,
        yaxis2: this.yaxis2,  
      },
    };

  }

  setStartDate = (date) => {
    this.setState( { startDate: date } ) 
  }

  setEndDate = (date) => {
    this.setState( { endDate: date } )
  }

  async getChartData(){
    let start = Math.trunc(Number(this.state.startDate)/1000)
    let end = Math.trunc(Number(this.state.endDate)/1000)
    const url = 'https://poloniex.com/public?command=returnChartData&currencyPair=USDT_BTC&start='+start+'&end='+end+'&period=14400'
    console.log('url = ', url )
    let chartData = []
    try {
      const res = await request.get(url);
      chartData = res.body;    // it should contain json data (header "content-type": "application/json")
    } catch (err) {
      console.error(err);
    }
    //console.log('chartData = ',chartData, 'is', typeof(chartData) )

    let dates = []
    let openPrices = []
    let highPrices = []
    let lowPrices = []
    let closePrices = []
    let volumes = []

    let bar = {}
    let i = 0;
    while(i < chartData.length){
      bar = chartData[i]
      let date = new Date(1000*bar.date)

      //dates[i] = new Intl.DateTimeFormat('uk', {timeStyle: "short", dateStyle: "short"}).format(date)
      dates[i] = date
      openPrices[i] = bar.open
      highPrices[i] = bar.high
      lowPrices[i] = bar.low
      closePrices[i] = bar.close
      volumes[i] = bar.volume
      i++;
    }

    //console.log(dates, openPrices,highPrices,lowPrices,closePrices,volumes);
    //console.log('this.yaxis2=',this.yaxis2);

    this.setState({
        data: [
          {
            x: dates,
            close: closePrices,
            high: highPrices,
            low: lowPrices,
            open: openPrices,

            type: "candlestick",

            name: "scatter",
            xaxis: 'x', 
            yaxis: 'y'
          },

          { type: "bar", 
            name: "volume", 
            yaxis: 'y2',
            x: dates, 
            y: volumes 
          },
        ],

        layout: { 
          dragmode: 'zoom', 
          margin: {
            r: 10, 
            t: 25, 
            b: 40, 
            l: 60
          }, 
          showlegend: false, 
          xaxis: {
            autorange: true, 
            //domain: [0, 1], 
            range: [this.state.startDate, this.state.endDate], 
            rangeslider: {range: [this.state.startDate, this.state.endDate],}, 
  
            title: 'Date', 
            type: 'date'
          }, 
          yaxis: {
            autorange: true, 
            domain: [0.11, 1],  
            type: 'linear'
          },
          yaxis2: this.yaxis2,  
 
        },
      });
  }

  componentDidMount() {

    this.getChartData()


  }

  render() {

    return (

      <div style={{ width: "100%", height: "100%" }}>
        <Header  startDate = {this.state.startDate}/>
        <Row>
          <DatesRangePicker 
            startDate = {this.state.startDate}
            setStartDate = {this.setStartDate}
            endDate = {this.state.endDate}
            setEndDate = {this.setEndDate}
          />
          <Button onClick={this.getChartData.bind(this)}>Force revive data</Button>
        </Row>
        
        <Plot
          style = {{ width: "90%",  }}
          data = {this.state.data}
          layout = {this.state.layout}
          onInitialized={(figure) => this.setState(figure)}
          onUpdate={(figure) => this.setState(figure)}

        />

      </div>

    );

  }

}

export default App;
