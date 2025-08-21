const { get } = require("express/lib/response");

import db from '../models/index';

let getHomePage = async(req, res) => {
    try{
        let data = await db.User.findAll();
        console.log(data);
        return res.render('homePage.ejs', {
            data: data
        });
    }
    catch(e)
    {
        console.log(e);
    }
}
let getAboutPage = (req, res) => {
    return res.render('about.ejs');
}


module.exports = {
    getHomePage : getHomePage,
    getAboutPage : getAboutPage
}  