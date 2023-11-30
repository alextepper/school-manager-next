import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import api from "src/utils/api";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    try {
      const user = localStorage.getItem("user");
      if (user) {
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user,
        });
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: "5e86809283e28b96d2d38537",
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: "Anika Visser",
      email: "anika.visser@devias.io",
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signIn = async (email, password) => {
    try {
      const endpoint = "/login/";

      const response = await api.post(endpoint, {
        email,
        password,
      });
      // Assuming the backend returns a token
      const user = JSON.stringify(response.data);

      // Store the token in localStorage or context for later use
      localStorage.setItem("user", user);
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: response.data,
      });
    } catch (err) {
      console.log(err);
    }

    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }
  };

  const signUp = async (email, name, password) => {
    try {
      const endpoint = "/register/";

      const response = await api.post(endpoint, {
        email,
        password,
        username: name,
      });
      // Assuming the backend returns a token
      const user = JSON.stringify(response.data);

      // Store the token in localStorage or context for later use
      localStorage.setItem("user", user);
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: response.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const signOut = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const refreshToken = user.tokens.refresh;

    if (refreshToken) {
      try {
        await api.post("/logout/", {
          refresh: refreshToken,
        });

        // Clear tokens from storage and update state after successful logout

        dispatch({
          type: HANDLERS.SIGN_OUT,
        });
        localStorage.removeItem("user");
      } catch (err) {
        console.error("Error during logout:", err);
        // Optionally handle errors (e.g., show a message to the user)
      }
    } else {
      console.error("No refresh token found");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
