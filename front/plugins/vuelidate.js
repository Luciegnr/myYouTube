import { extend } from "vee-validate";
import { required, alpha, email } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required",
});

extend("alpha", {
  ...alpha,
  message: "This field must only contain alphabetic characters",
});
extend("email", {
  ...email,
  message: "Email not correct",
});