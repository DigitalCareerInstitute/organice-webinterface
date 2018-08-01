import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    auth: false,
    alert: false,
    form: {
      email: "",
      password: ""
    }
  }
  onChange = (event) => {
    let form = {...this.state.form}
    form[event.target.id] = event.target.value
    this.setState({form})
  }
  onSubmit = (event) => {
    event.preventDefault();
    fetch('http://organize.tmy.io/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.form.email.toLowerCase(),
        password: this.state.form.password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if(data.user.token){
          let shortToken = data.user.token.substring(0, data.user.token.length - 170)
          this.setState({auth: true, alert: {"success": `Yay - welcome ${data.user.name}, your token is${shortToken} ...`}})
        } else if (data.code === 401){
          this.setState({auth: false, alert: {"error": data.message}})
        }
        localStorage.setItem("token", data.user.token)
      })
      .catch(err => {
        console.log(err)
      })
    }
  render() {
    var loginButton = "";
    if (this.state.alert.error) {
      alert = <div className="alert alert-danger fixed-bottom text-center mb-0">{this.state.alert.error} </div>;
    } else if(this.state.alert.success) {
      alert = <div className="alert alert-success fixed-bottom text-center mb-0">{this.state.alert.success} </div>;
    }

    setTimeout(
      function () {
        this.setState({ alert: false });
      }
        .bind(this),
      3000
    );

    if (this.state.auth) {
      loginButton = <a class="nav-link active" href="#">Logged in</a>;
    } else {
      loginButton = <a class="nav-link disabled" href="#">Logged out</a>;
    }
    return (
      <div className="h-100">
      {alert}
        <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              
              <li class="nav-item">
                {loginButton} 
              </li>
            </ul>
          </div>
        </nav>
        <div className="App">

          <form onSubmit={this.onSubmit} className="form-signin">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="h3 my-5 font-weight-normal">Welcome to OrgaNice</h1>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input onChange={this.onChange} type="email" id="email" className="form-control" placeholder="Email address" required autoFocus/>
            <label htmlFor="password" className="sr-only">Password</label>
            <input onChange={this.onChange} type="password" id="password" className="form-control" placeholder="Password" required/>
            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me"/> Remember me
              </label>
            </div>
            <button className="btn btn-lg btn-primary btn-block">Sign in</button>
            <p className="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
