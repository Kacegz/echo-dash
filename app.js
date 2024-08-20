const express = require("express");
const app = express();
const router = require("./routes/userRouter");
app.use(express.urlencoded({ extended: false }));

app.use("/", router);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
