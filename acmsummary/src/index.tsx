import React from 'react';
import ReactDOM from 'react-dom/client';
import routers from './router/routers'
import { RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
<RouterProvider router = {routers} />
);
