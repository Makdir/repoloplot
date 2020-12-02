import React from 'react';
//import

class Header extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {}
    }

    render(){
        
        return (
        <div className="alert alert-primary" role="alert" style={{ width: "100%", height: "100%" }}>
            <hr/>
            <b>{String(this.props.startDate)}</b>
            <hr/>
      </div>
      )
    }
}

export default Header 