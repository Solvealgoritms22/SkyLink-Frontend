// src/app/store/app.reducer.ts
import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';

// Importa aquí otros reducers:
// import { authReducer } from './reducers/auth.reducer';
// import { productsReducer } from './reducers/products.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  // auth: authReducer,
  // products: productsReducer
};
