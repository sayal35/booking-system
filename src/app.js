const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/sports", require("./routes/sportRoutes"));
app.use("/api/venues", require("./routes/venueRoutes"));
app.use("/api/courts", require("./routes/courtRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

module.exports = app;
