const User= require('../Model/user')

module.exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLogedIn,
  });
};

module.exports.postLogin=(req,res,next)=>{
   User.findById("60ed68b3076fcc405ca9635f")
     .then((user) => {
       req.session.isLogedIn = true;
       req.session.user = user;
       req.session.save((err) => {
          res.redirect("/");
       })
      
     })
     .catch((err) => {
       console.log(err);
     });


}

module.exports.postLogout=(req,res,next)=>{
     req.session.destroy((err) => {
       console.log(err)
        res.redirect("/");
     })
 
}
