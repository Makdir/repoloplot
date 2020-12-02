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
            yaxis: 'y',
            tickformat: '%H~%M~%S.%2f'
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
