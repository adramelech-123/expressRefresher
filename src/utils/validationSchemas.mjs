export const userValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be 5 - 32 characters!",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty!",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },

  displayName: {
    notEmpty: {
      errorMessage: "Display Name cannot be empty!",
    },
    isString: true,
  },

  password: {
    isLength: {
      options: {
        min: 5
      },
      errorMessage: "Passowrd must be a minimum of 5 characters!",
    },
    notEmpty: {
      errorMessage: "Passowrd field cannot be empty!",
    }
  },
};

export const queryValidationSchema = {
  filter: {
    isString: {
      errorMessage: "Query must be a string",
    },
    notEmpty: {
      errorMessage: "Query must not be empty!",
    },
    isLength: {
      options: {
        min: 3,
        max: 10,
      },

      errorMessage: "Must be at least 3 - 10 characters",
    },
  },
};
