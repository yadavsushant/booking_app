import React, { Component,useState  } from 'react'; 
import axios from 'axios';
import './App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TIME_OF_FUNCTION = ["11.30 AM to 4.30 PM", "7.00 PM to 12.00 PM", "Other"];
const FUNCTION_MEAN = ["Wallima","Wedding Reception","Birthday","Charity","Other"];
const VENUE = ["Lotus garden - $5K","Versailles palace - $10K","Other"];
const CATERING_MENU = ["Silver - $19.50 per head","Gold  - $27.50 per head","Other"];
const ENTERTAINMENT = ["Videography & Cinematography","Waiters","DJ","Sound & Light","Fireworks","Helicopter","Super Car","Rolls Royce","Wedding Cake","Violinist","Egyptian Sufi","Dancers","Other"];

const BookingDatepicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker  className="form-control" id="booking_date" name="booking_date" selected={startDate} minDate={startDate} onChange={date => setStartDate(date)}  />
  );
};

const FunctionDatepicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker  className="form-control" id="function_date" name="function_date" selected={startDate} minDate={startDate} onChange={date => setStartDate(date)} />
  );
};


class App extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      cls_function_time_other: '_function_time_other',
      cls_function_mean_other: '_function_mean_other',
      cls_venue_other: '_venue_other',
      cls_catering_menu_other: '_catering_menu_other',
      cls_entertainment_other: '_entertainment_other',
      venue_amount:0,
      no_of_guest:0,
      menu_price:0,
      extra_amount:0,
      amount:0,
      package_price:0,
      fields: {},
      errors: {}
    };
  }
  calculate(e){
    let no_of_guest=parseFloat(this.state.no_of_guest);
    let extra_amount=parseFloat(this.state.extra_amount);

    if(e)
    {
      let amt = (e.target.value)?e.target.value:0;
      switch(e.target.id){
        case "no_of_guest" : this.setState({no_of_guest: amt});  no_of_guest=amt; extra_amount=parseFloat(this.state.extra_amount); break;
        case "extra_amount" : this.setState({extra_amount: amt}); extra_amount=amt; no_of_guest=parseFloat(this.state.no_of_guest); break;
        default: 
      }
    }
    let venue=parseFloat(this.state.venue_amount);
    let menu_price=parseFloat(this.state.menu_price);

    let amount=venue+(no_of_guest*menu_price);
    let package_price=parseFloat(amount)+parseFloat(extra_amount);

    this.setState({amount:amount}); 
    this.setState({package_price:package_price}); 
  }
  handleChange(field,e){
    let fields = this.state.fields;
    fields[field] = e.target.value;        
    this.setState({fields});

    switch(field){
      case "function_time" : 
        if(e.target.value==="Other") this.setState({cls_function_time_other: 'function_time_other_'});
        else this.setState({cls_function_time_other: '_function_time_other'});
        break;
      case "function_mean" : 
        if(e.target.value==="Other") this.setState({cls_function_mean_other: 'function_mean_other_'});
        else this.setState({cls_function_mean_other: '_function_mean_other'});
        break;
      case "venue" : 
        switch(e.target.value){
          case "Lotus garden - $5K" : 
            this.setState({venue_amount: 5}); 
            this.setState({cls_venue_other: '_venue_other'});    
            break;
          case "Versailles palace - $10K" : 
            this.setState({venue_amount: 10}); 
            this.setState({cls_venue_other: '_venue_other'});
            break;
          case "Other" : 
            this.setState({venue_amount: 0}); 
            this.setState({cls_venue_other: 'venue_other_'})
            break;
          default: 
        }
        this.calculate();
        break;
      case "catering_menu" : 
        if(e.target.value==="Other") this.setState({cls_catering_menu_other: 'catering_menu_other_'});
        else this.setState({cls_catering_menu_other: '_catering_menu_other'});
        switch(e.target.value){
          case "Silver - $19.50 per head": 
            this.setState({menu_price: 19.50});
            this.setState({cls_catering_menu_other: '_catering_menu_other'});
            break;
          case "Gold  - $27.50 per head": 
            this.setState({menu_price: 27.50});
            this.setState({cls_catering_menu_other: '_catering_menu_other'});
            break;
          case "Other" : 
            this.setState({menu_price: 0}); 
            this.setState({cls_catering_menu_other: 'catering_menu_other_'})
            break;
          default:
        }
        this.calculate();
        break;
      case "entertainment" : 
        if(e.target.value==="Other") this.setState({cls_entertainment_other: 'entertainment_other_'});
        else this.setState({cls_entertainment_other: '_entertainment_other'});
        break;
      default:
    }
    
  }
  handleValidation(){
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if(!fields["name"]){
       formIsValid = false;
       errors["name"] = "Name cannot be empty.";
    }

    if(!fields["email"]){
      formIsValid = false;
      errors["email"] = "Email cannot be empty.";
    }

    if(typeof fields["email"] !== "undefined"){
      let lastAtPos = fields["email"].lastIndexOf('@');
      let lastDotPos = fields["email"].lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
      formIsValid = false;
        errors["email"] = "Email is not valid.";
      }
    }  

    if(!fields["mobile_no"]){
      formIsValid = false;
      errors["mobile_no"] = "Mobile No. cannot be empty.";
    }
    if(!fields["address"]){
      formIsValid = false;
      errors["address"] = "Address cannot be empty.";
    }

    if(!fields["postcode"]){
      formIsValid = false;
      errors["postcode"] = "Postcode cannot be empty.";
    }
    if(!fields["function_time"]){
      formIsValid = false;
      errors["function_time"] = "Function time cannot be empty.";
    }
    else if(fields["function_time"]==="Other" && !fields["function_time_other"]){
      formIsValid = false;
      errors["function_time_other"] = "Other cannot be empty.";
    }

    if(!fields["function_mean"]){
      formIsValid = false;
      errors["function_mean"] = "Function mean cannot be empty.";
    }
    else if(fields["function_mean"]==="Other" && !fields["function_mean_other"]){
      formIsValid = false;
      errors["function_mean_other"] = "Other cannot be empty.";
    }

    if(!fields["venue"]){
      formIsValid = false;
      errors["venue"] = "Venue cannot be empty.";
    }
    else if(fields["venue"]==="Other" && !fields["venue_other"]){
      formIsValid = false;
      errors["venue_other"] = "Other cannot be empty.";
    }

    if(!fields["catering_menu"]){
      formIsValid = false;
      errors["catering_menu"] = "Catering menu cannot be empty.";
    }
    else if(fields["catering_menu"]==="Other" && !fields["catering_menu_other"]){
      formIsValid = false;
      errors["catering_menu_other"] = "Other cannot be empty.";
    }

    if(!fields["entertainment"]){
      formIsValid = false;
      errors["entertainment"] = "Entertainment cannot be empty.";
    }
    else if(fields["entertainment"]==="Other" && !fields["entertainment_other"]){
      formIsValid = false;
      errors["entertainment_other"] = "Other cannot be empty.";
    }

    if(!fields["no_of_guest"]){
      formIsValid = false;
      errors["no_of_guest"] = "No. of guest cannot be empty.";
    }

    this.setState({errors: errors});
    return formIsValid;
  }

  formSubmit(e){
    e.preventDefault();
    if(this.handleValidation()){
      const formData = new FormData();
      formData.set('name', (this.state.fields["name"])?this.state.fields["name"]:'' );
      formData.set('email', (this.state.fields["email"])?this.state.fields["email"]:'');
      formData.set('mobile_no', (this.state.fields["mobile_no"])?this.state.fields["mobile_no"]:'');
      formData.set('landline_no', (this.state.fields["landline_no"])?this.state.fields["landline_no"]:'');
      formData.set('address', (this.state.fields["address"])?this.state.fields["address"]:'');
      formData.set('postcode', (this.state.fields["postcode"])?this.state.fields["postcode"]:'');
      formData.set('booking_date', (this.state.fields["booking_date"])?this.state.fields["booking_date"]:'');
      formData.set('function_date', (this.state.fields["function_date"])?this.state.fields["function_date"]:'');
      formData.set('function_time', (this.state.fields["function_time"])?this.state.fields["function_time"]:'');
      formData.set('function_time_other', (this.state.fields["function_time"]==="Other")?this.state.fields["function_time_other"]:'' );
      formData.set('function_mean', (this.state.fields["function_mean"])?this.state.fields["function_mean"]:'');
      formData.set('function_mean_other', (this.state.fields["function_mean"]==="Other")?this.state.fields["function_mean_other"]:'' );
      formData.set('venue', (this.state.fields["venue"])?this.state.fields["venue"]:'');
      formData.set('venue_other', (this.state.fields["venue"]==="Other")?this.state.fields["venue_other"]:'' );
      formData.set('catering_menu', (this.state.fields["catering_menu"])?this.state.fields["catering_menu"]:'');
      formData.set('catering_menu_other', (this.state.fields["catering_menu"]==="Other")?this.state.fields["catering_menu_other"]:'' );
      formData.set('entertainment', (this.state.fields["entertainment"])?this.state.fields["entertainment"]:'');
      formData.set('entertainment_other', (this.state.fields["entertainment"]==="Other")?this.state.fields["entertainment_other"]:'' );
      formData.set('amount', (this.state.fields["total_amount"])?this.state.fields["total_amount"]:'');
      formData.set('extra', (this.state.fields["extra_amount"])?this.state.fields["extra_amount"]:'');
      formData.set('package_price', (this.state.fields["package_price"])?this.state.fields["package_price"]:'');
      
      axios({
        method: 'post',
        url: 'http://localhost/booking_app_api/Api.php',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      })
      .then(function (response) {
        alert(response.data.message);
      })
      .catch(function (response) {
          console.log(response)
      });
    }else{
      alert("This form has errors.")
    }
  }
  render() { 
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>Booking App</h2>
            </div>
          </div>
        </div>
        <div className="container">
          <form name="form"  onSubmit= {this.formSubmit.bind(this)}  ref={(el) => this.myFormRef = el}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"><span>Customer Details</span></h5>
              <div className="row">
                <div className="col-md-6">
                  <label className="control-label">Name</label>
                  <input type="text" className="form-control" id="name" name="name" autoComplete="off" onChange={this.handleChange.bind(this,"name")} value={this.state.fields["name"]}/>
                  <span className="error-block">{this.state.errors["name"]}</span>
                </div>
                <div className="col-md-6">
                  <label className="control-label">Email</label>
                  <input type="text" className="form-control" id="email" name="email" autoComplete="off" onChange={this.handleChange.bind(this,"email")} value={this.state.fields["email"]}/>
                  <span className="error-block">{this.state.errors["email"]}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label className="control-label">Mobile No.</label>
                  <input type="text" className="form-control" id="mobile_no" name="mobile_no" autoComplete="off" onChange={this.handleChange.bind(this,"mobile_no")} value={this.state.fields["mobile_no"]}/>
                  <span className="error-block">{this.state.errors["mobile_no"]}</span>
                </div>
                <div className="col-md-6">
                  <label className="control-label">Landline No.</label>
                  <input type="text" className="form-control" id="landline_no" name="landline_no" autoComplete="off" onChange={this.handleChange.bind(this,"landline_no")} value={this.state.fields["landline_no"]}/>
                  <span className="error-block">{this.state.errors["landline_no"]}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label className="control-label">Address</label>
                  <textarea className="form-control" id="address" name="address" autoComplete="off" onChange={this.handleChange.bind(this,"address")} >{this.state.fields["address"]}</textarea>
                  <span className="error-block">{this.state.errors["address"]}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label className="control-label">Postcode</label>
                  <input type="text" className="form-control" id="postcode" name="postcode" autoComplete="off" onChange={this.handleChange.bind(this,"postcode")} value={this.state.fields["postcode"]}/>
                  <span className="error-block">{this.state.errors["postcode"]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"><span>Date</span></h5>
              <div className="row">
                <div className="col-md-6">
                  <label className="control-label">Date of Booking</label>
                  <BookingDatepicker />
                </div>
                <div className="col-md-6">
                  <label className="control-label">Date of Function</label>
                  <FunctionDatepicker />
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"><span>Time of Functions</span></h5>
              <div className="row">
                <div className="col-md-6">
                  <select className="form-control" id="function_time" name="function_time" onChange={this.handleChange.bind(this,"function_time")} value={this.state.fields["function_time"]}>
                    <option value="">Select</option>
                    { TIME_OF_FUNCTION.map(option => {
                      return <option value={option} key={option} >{option}</option>
                    })}
                  </select>
                  <span className="error-block">{this.state.errors["function_time"]}</span>
                </div>
                <div className="col-md-6" id={this.state.cls_function_time_other}>
                  <input type="text" className="form-control" id="function_time_other" name="function_time_other" autoComplete="off" placeholder="Other" onChange={this.handleChange.bind(this,"function_time_other")} value={this.state.fields["function_time_other"]}/>
                  <span className="error-block">{this.state.errors["function_time_other"]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"><span>Function Mean</span></h5>
              <div className="row">
                <div className="col-md-6">
                  <select className="form-control" id="function_mean" name="function_mean"  onChange={this.handleChange.bind(this,"function_mean")}  value={this.state.fields["function_mean"]}>
                    <option value="">Select</option>
                    { FUNCTION_MEAN.map(option => {
                      return <option value={option} key={option} >{option}</option>
                    })}
                  </select>
                  <span className="error-block">{this.state.errors["function_mean"]}</span>
                </div>
                <div className="col-md-6" id={this.state.cls_function_mean_other}>
                  <input type="text" className="form-control" id="function_mean_other" name="function_mean_other" autoComplete="off"  placeholder="Other"  onChange={this.handleChange.bind(this,"function_mean_other")} value={this.state.fields["function_mean_other"]}/>
                  <span className="error-block">{this.state.errors["function_mean_other"]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"><span>Venue</span></h5>
              <div className="row">
                <div className="col-md-6">
                  <select className="form-control" id="venue" name="venue" onChange={this.handleChange.bind(this,"venue")} value={this.state.fields["venue"]}>
                    <option value="">Select</option>
                    { VENUE.map(option => {
                      return <option value={option} key={option} >{option}</option>
                    })}
                  </select>
                  <span className="error-block">{this.state.errors["venue"]}</span>
                </div>
                <div className="col-md-6" id={this.state.cls_venue_other}>
                  <input type="text" className="form-control" id="venue_other" name="venue_other" autoComplete="off" placeholder="Other" onChange={this.handleChange.bind(this,"venue_other")} value={this.state.fields["venue_other"]}/>
                  <span className="error-block">{this.state.errors["venue_other"]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"><span>Catering Menu</span></h5>
              <div className="row">
                <div className="col-md-6">
                  <select className="form-control" id="catering_menu" name="catering_menu" onChange={this.handleChange.bind(this,"catering_menu")} value={this.state.fields["catering_menu"]}>
                    <option value="">Select</option>
                    { CATERING_MENU.map(option => {
                      return <option value={option} key={option} >{option}</option>
                    })}
                  </select>
                  <span className="error-block">{this.state.errors["catering_menu"]}</span>
                </div>
                <div className="col-md-6" id={this.state.cls_catering_menu_other}>
                  <input type="text" className="form-control" id="catering_menu_other" name="catering_menu_other" autoComplete="off" placeholder="Other"  onChange={this.handleChange.bind(this,"catering_menu_other")} value={this.state.fields["catering_menu_other"]}/>
                  <span className="error-block">{this.state.errors["cls_catering_menu_other"]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"><span>Entertainment / Extras</span></h5>
              <div className="row">
                <div className="col-md-6">
                  <select className="form-control" id="entertainment" name="entertainment" onChange={this.handleChange.bind(this,"entertainment")}  value={this.state.fields["entertainment"]}>
                    <option value="">Select</option>
                    { ENTERTAINMENT.map(option => {
                      return <option value={option} key={option} >{option}</option>
                    })}
                  </select>
                  <span className="error-block">{this.state.errors["entertainment"]}</span>
                </div>
                <div className="col-md-6" id={this.state.cls_entertainment_other}>
                  <input type="text" className="form-control" id="entertainment_other" name="entertainment_other" autoComplete="off" placeholder="Other"  onChange={this.handleChange.bind(this,"entertainment_other")} value={this.state.fields["entertainment_other"]}/>
                  <span className="error-block">{this.state.errors["entertainment_other"]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"><span>No. of Guest</span></h5>
              <div className="row">
                <div className="col-md-6">
                  <input type="text" className="form-control" id="no_of_guest" name="no_of_guest" autoComplete="off" onKeyUp={this.calculate.bind(this)} onChange={this.handleChange.bind(this,"no_of_guest")} value={this.state.fields["no_of_guest"]}/>
                  <span className="error-block">{this.state.errors["no_of_guest"]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"><span>Package Price</span></h5>
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label">Amount</label>
                  <input type="text" className="form-control" id="total_amount" name="total_amount" autoComplete="off" placeholder="Amount" value={this.state.amount} readOnly />
                  <span className="error-block">{this.state.errors["total_amount"]}</span>
                </div>
                <div className="col-md-2">
                  <label className="control-label">Extra</label>
                  <input type="text" className="form-control" id="extra_amount" name="extra_amount" autoComplete="off" placeholder="Extra" onKeyUp={this.calculate.bind(this)} value={this.state.fields["extra_amount"]}/>
                  <span className="error-block">{this.state.errors["extra_amount"]}</span>
                </div>
                <div className="col-md-2">
                  <label className="control-label">Package Price</label>
                  <input type="text" className="form-control" id="package_price" name="package_price" autoComplete="off" placeholder="Package Price" value={this.state.package_price} readOnly/>
                  <span className="error-block">{this.state.errors["package_price"]}</span>
                </div>
                <div className="col-md-6 formula">
                  Package Price = Venue  +  ( No. of Guest  x Menu Price) + Extra
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button id="saveBtn"  className="btn btn-md btn-primary" >Save</button>
            </div>
          </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
