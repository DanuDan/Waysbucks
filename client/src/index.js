import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserContextProvider } from './context/useContext';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
const client = new QueryClient();

root.render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>
);
