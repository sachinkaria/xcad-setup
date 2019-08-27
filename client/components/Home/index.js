import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email : '', password: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const user = this.state;
    const field = event.target.name;
    user[field] = event.target.value;
    this.setState(user);
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
  }

  render() {
    return (
      <div style={{ marginTop: '50px' }}>
        <h1>Sign Up</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="email">
            Email
            <input onChange={this.handleChange} type="text" name="email" />
          </label>
          <label htmlFor="password">
            Password
            <input onChange={this.handleChange} type="password" name="password" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Home;
