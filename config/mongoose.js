const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://mohamad-khudeer:mohamad12345@the-timeline-database.xqkfosb.mongodb.net/?appName=the-timeline-database")
    .then( () => {
        console.log("DB is connected")
    })
    .catch( err => {
        console.log(err)
    })