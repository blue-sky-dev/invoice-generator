import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '$',
      currentDate: '',
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: '',
      billFromEmail: '',
      billFromAddress: '',
      notes: '',
      subTotal: '0.00',
      taxRate: '0.0',
      taxAmmount: '0.00',
      total: '0.00',
      taxRate: '0.0',
      taxAmmount: '0.00',
      discountRate: '0.0',
      discountAmmount: '0.00',
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        price: '0.00',
        quantity: 1,
      },
    ];
    this.editField = this.editField.bind(this);
  }
  componentDidMount(prevProps) {
    this.handleCalculateTotal()
  }
  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  };
  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: '',
      price: '0.00',
      description: '',
      quantity: 1
    }
    this.state.items.push(items);
    this.setState(this.state.items);
  }
  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0.0;
    var discount = this.state.discount;
    items.map(function(items) {
      subTotal = parseFloat((subTotal + (parseFloat(items.price) * parseInt(items.quantity)))).toFixed(2)
    });
    // set subTotal
    this.setState({subTotal: subTotal});
    // set taxRate and taxAmmount
    this.setState({taxAmmount: (subTotal * parseFloat(this.state.taxRate)) / 100 });
    // set discountRate and discountAmmount
    this.setState({discountAmmount: (subTotal * parseFloat(this.state.discountRate)) / 100 });
    // set Total
    this.setState({total: parseFloat((subTotal - this.state.discountAmmount) + this.state.taxAmmount ).toFixed(2) });
  };
  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var items = this.state.items.slice();
    var newItems = items.map(function(items) {
      for (var key in items) {
        if (key == item.name && items.id == item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.handleCalculateTotal();
    this.setState({items:newItems});
  };
  editField = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    this.handleCalculateTotal();
  };
  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };
  openModal = (event) => {
    event.preventDefault()
    this.handleCalculateTotal()
    this.setState({ isOpen: true })
  };
  closeModal = (event) => this.setState({
     isOpen: false
  });
  render() {
    return(
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={8} xl={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-center justify-content-between mb-3">
                <div>
                  <span className="fw-bold">Date:&nbsp;</span>
                  <span className="current-date">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due Date:</span>
                  <Form.Control type="date" value={this.state.dateOfIssue} name={"dateOfIssue"} onChange={(event)=>this.editField(event)} style={{maxWidth: '150px'}} required/>
                </div>
              </div>
              <div className="w-100 text-left text-lg-center mt-5 mt-lg-0 mb-5 d-none">
                <h3 className="fw-bold">Invoice #<span className="text-primary">001</span></h3>
              </div>
              <hr className="my-4"/>
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control
                    placeholder={"Who is this invoice to?"}
                    rows={3}
                    value={this.state.billTo}
                    type="text"
                    name="billTo"
                    className="my-2"
                    onChange={(event)=>this.editField(event)}
                    autoComplete="name"
                    required />
                  <Form.Control
                    placeholder={"Email address"}
                    value={this.state.billToEmail}
                    type="email"
                    name="billToEmail"
                    className="my-2"
                    onChange={(event)=>this.editField(event)}
                    autoComplete="email"
                    required />
                  <Form.Control
                    placeholder={"Billing address"}
                    value={this.state.billToAddress}
                    type="text"
                    name="billToAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event)=>this.editField(event)}
                    required />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Bill from:</Form.Label>
                  <Form.Control
                    placeholder={"Who is this invoice from?"}
                    rows={3}
                    value={this.state.billFrom}
                    type="text"
                    name="billFrom"
                    className="my-2"
                    onChange={(event)=>this.editField(event)}
                    autoComplete="name"
                    required/>
                  <Form.Control
                    placeholder={"Email address"}
                    value={this.state.billFromEmail}
                    type="email"
                    name="billFromEmail"
                    className="my-2"
                    onChange={(event)=>this.editField(event)}
                    autoComplete="email"
                    required/>
                  <Form.Control
                    placeholder={"Billing address"}
                    value={this.state.billFromAddress}
                    type="text"
                    name="billFromAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event)=>this.editField(event)}
                    required/>
                </Col>
              </Row>
              <InvoiceItem onItemizedItemEdit={this.onItemizedItemEdit.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} currency={this.state.currency} items={this.state.items}/>
              <Row className="mt-4 justify-content-end">
                <Col lg={6} >
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal: </span>
                    <span>{this.state.currency} {this.state.subTotal||0}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Discount:</span>
                    <span>{this.state.currency} {this.state.discountAmmount||0.0}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Tax: </span>
                    <span>{this.state.currency} {this.state.taxAmmount||0.0} <span className="small ">({this.state.taxRate||0.0}%)</span></span>
                  </div>
                  <hr/>
                  <div className="d-flex flex-row align-items-start justify-content-between" style={{fontSize: '1.125rem'}}>
                    <span className="fw-bold">Total: </span>
                    <span className="fw-bold">{this.state.currency} {this.state.total||0}</span>
                  </div>
                </Col>
              </Row>
              <hr className="my-4"/>
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control placeholder="Thanks for your business!" onChange={(event)=>this.editField(event)} as="textarea" className="my-2" rows={1}/>
            </Card>
          </Col>
          <Col md={4} xl={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100">Review Invoice</Button>
              <InvoiceModal showModal={this.state.isOpen} closeModal={this.closeModal} info={this.state} items={this.state.items} currency={this.state.currency} total={this.state.total} taxAmmount={this.state.taxAmmount} subTotal={this.state.subTotal}></InvoiceModal>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select onChange={event => this.onCurrencyChange({ currency: event.target.value })} className="btn btn-light my-1" aria-label="Change Currency">
                  <option value="$">USD (United States Dollar)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                  <option value="$">CAD (Canadian Dollar)</option>
                  <option value="$">AUD (Australian Dollar)</option>
                  <option value="$">SGD (Signapore Dollar)</option>
                  <option value="¥">CNY (Chinese Renminbi)</option>
                  <option value="₿">BTC (Bitcoin)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Tax rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control name="taxRate" type="number" value={this.state.taxRate} onChange={(event)=>this.editField(event)} className="bg-white border" placeholder="0.0" min="0.0"/>
                  <InputGroup.Text
                    className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control name="discountRate" type="number" value={this.state.discountRate} onChange={(event)=>this.editField(event)} className="bg-white border" placeholder="0.0" min="0.0"/>
                  <InputGroup.Text
                    className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default InvoiceForm;
