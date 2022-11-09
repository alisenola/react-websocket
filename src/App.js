import React from 'react';
import { Button, Form } from 'react-bootstrap';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.connect();
  }

  connect = () => {
    const ws = new WebSocket("ws://localhost:3001/ws");
    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    ws.onopen = () => {
      console.log("connected websocket main component");

      this.setState({ ws: ws });

      that.timeout = 250; // reset timer to 250 on open of websocket connection 
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    }

    ws.onmessage = evt => {
      const message = JSON.parse(evt.data)
      console.log(message);
    }

    // websocket onclose event listener
    ws.onclose = e => {
        console.log(
            `Socket is closed. Reconnect will be attempted in ${Math.min(
                10000 / 1000,
                (that.timeout + that.timeout) / 1000
            )} second.`,
            e.reason
        );

        that.timeout = that.timeout + that.timeout; // increment retry interval
        connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    }

    // websocket onerror event listener
    ws.onerror = err => {
        console.error(
            "Socket encountered error: ",
            err.message,
            "Closing socket"
        );

        ws.close();
    }
  }

  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
  }

  handleSubmit() {

  }

  render() {
    return (
      <div className="App">
        <p className="title">Arbitrage Demo</p>
        <div className="content">
          <div className="left">
            <Form.Control className="ml-auto" />
            <p className="line">Coinbase: 4 BTC / $28000</p>
            <p className="line">Coinbase: 4 BTC / $28000</p>
            <p className="line">Coinbase: 4 BTC / $28000</p>
            <p className="line">Coinbase: 4 BTC / $28000</p>
            <p className="line">Total: 4 BTC / $28000</p>
          </div>
          <div className="right">
            <Form.Control />
            <p className="line">Coinbase: 4 BTC / $28000</p>
            <p className="line">Coinbase: 4 BTC / $28000</p>
            <p className="line">Coinbase: 4 BTC / $28000</p>
            <p className="line">Coinbase: 4 BTC / $28000</p>
            <p className="line">Total: 4 BTC / $28000</p>
          </div>
        </div>
        <div className="footer">
          <Button className="submit">Calculate</Button>
        </div>
      </div>
    );
  }
}

export default App;
