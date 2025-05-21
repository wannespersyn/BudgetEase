type RegisterRequestBody = {
    username: string;
    email: string;
    password: string;
    role: ROLES;
  };

type LoginRequestBody = {
    email: string;
    password: string;
};
  