const { get } = require("express/lib/response");

let getHomePage = (req, res) => {
    return res.render('homePage.ejs');
}
let getAboutPage = (req, res) => {
    return res.render('about.ejs');
}


module.exports = {
    getHomePage : getHomePage,
    getAboutPage : getAboutPage
}  