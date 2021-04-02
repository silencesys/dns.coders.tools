import React from 'react'
import ReactDOM from 'react-dom'

// Store
import { Provider } from 'react-redux';
import store from './store/index';

// App
import App from './App'
import './assets/colors.css'
import './assets/main.css'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
