import React, { useState } from "react";
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Jumbotron,
  Label
} from "reactstrap";
import axios from "axios";

function App() {
  const [user, setUser] = useState({ id: "" });
  const [transactions, setTransactions] = useState(null);
  const [total, setTotal] = useState(0);

  const handleChange = event => {
    setUser({ [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    setTransactions(null);

    if (!user.id) {
      return;
    }

    axios
      .get("http://localhost:5000/chain")
      .then(res => {
        setTransactions([
          ...res.data.chain.flatMap(block => {
            return block.transactions;
          })
        ]);

        let trans = res.data.chain.flatMap(block => {
          return block.transactions;
        });

        let wallet = trans.map(block => {
          if (block.recipient === user.id) {
            return block.amount;
          } else if (block.sender === user.id) {
            return block.amount * -1;
          } else {
            return 0;
          }
        });

        let walletTotal = wallet.reduce((acc, curr) => {
          return acc + curr;
        }, 0);

        setTotal(walletTotal);
      })
      .catch(err => {
        console.log(err.response.message);
      });
  };

  const renderTransactions = listOfTransactions => {
    let list = listOfTransactions.map((block, index) => {
      if (block.sender === user.id) {
        return (
          <div key={index}>
            <div>Sender: {block.sender}</div>
            <div>Recipient: {block.recipient}</div>
            <div>
              Amount: <span style={{ color: "red" }}>-{block.amount}</span>
            </div>
          </div>
        );
      } else if (block.recipient === user.id) {
        return (
          <div key={index}>
            <div>Sender: {block.sender}</div>
            <div>Recipient: {block.recipient}</div>
            <div>
              Amount: <span style={{ color: "green" }}>+{block.amount}</span>
            </div>
          </div>
        );
      } else {
        return <></>;
      }
    });
    return list;
  };

  return (
    <Container className="themed-container" fluid={true}>
      {/* Start of Banner */}
      <Jumbotron fluid>
        <Container fluid>
          <h1 className="display-3">Lambda Wallet</h1>
          <p className="lead">
            A small application to mine local "Lambda School" generated coins.
          </p>
        </Container>
      </Jumbotron>
      {/* Start of Form */}
      <Form onSubmit={handleSubmit}>
        <h3>Select an ID to check:</h3>
        <FormGroup>
          <Label for="id">ID</Label>
          <Input
            type="id"
            name="id"
            id="id"
            placeholder="Enter an ID"
            onChange={handleChange}
          />
        </FormGroup>
        <Button color="primary">Select</Button>
      </Form>
      <h4 style={{ marginTop: ".3rem" }}>
        Total:{" "}
        <span
          style={
            total
              ? { color: "green" }
              : total === 0
              ? { color: "black" }
              : { color: "red" }
          }
        >
          {total ? "+" : total === 0 ? "" : "-"}
          {total}
        </span>
      </h4>
      <div>{transactions && renderTransactions(transactions)}</div>
    </Container>
  );
}

export default App;
