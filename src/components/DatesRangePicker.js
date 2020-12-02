import React from 'react';
import DatePicker from 'react-datepicker';
import Row from 'react-bootstrap/Button';
 
import "react-datepicker/dist/react-datepicker.css";

class DatesRangePicker extends React.Component {

  render() {
    //const [startDate, setStartDate] = useState(new Date());
    return (

      <Row className = 'p-200'>
        <DatePicker
          selected={this.props.startDate}
          onChange={date => this.props.setStartDate(date)}
          selectsStart
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          dateFormat="yyyy-MM-dd"
        />
        <b>&nbsp;-&nbsp;</b>
        <DatePicker
            selected={this.props.endDate}
            onChange={date => this.props.setEndDate(date)}
            selectsEnd
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            minDate={this.props.startDate}
            dateFormat="yyyy-MM-dd"
        />
      </Row>

    );
  }
}

export default DatesRangePicker 