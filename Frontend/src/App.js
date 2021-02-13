import logo from './logo.svg';
import './App.css';
import Handler from 'asyncstoragehandler'


const Parse = require('parse/react-native.js');

Parse.initialize("YOUR_APP_ID");
Parse.serverURL = 'http://localhost:1337/parse'
Parse.setAsyncStorage(Handler)

class Message extends Parse.Object {
  constructor(user, text){
    super('Message');
    this.text = text;
    this.users.push(user);
  }
}

Parse.Object.registerSubclass('Message', Message);

class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
      Handler : new Handler(),
      serverResponse: ""
    }
  }

  callAPI() {
      const message = new Message("Hello!", "123UserID");
      
      message.save()
        .then((messege) => {
          this.setState({
            serverResponse: message.text
          })
        }, (error) => {
          alert('Object creation failure. Error code: ' + error.message);
        })
  }

  componentWillMount() {
      this.callAPI();
  }

  render(){
    return{

    }
  }
}

export default App;
