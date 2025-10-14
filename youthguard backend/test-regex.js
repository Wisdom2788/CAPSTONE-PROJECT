const password = "Password1";
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
console.log("Password:", password);
console.log("Regex test result:", regex.test(password));