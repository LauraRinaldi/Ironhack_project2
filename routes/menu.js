var express = require('express');
var router = express.Router();

const Menu = require("../models/Menu")
const Item = require("../models/Item")


const menuId = '64b595ab75110db49c4e9280'


/* GET users listing. */
router.get('/', function(req, res, next) {
  Menu.findById(menuId)
  .populate("items")
  .then((foundMenu) => {
    console.log("Found menu", foundMenu, req.session.user)
    res.render("menu/all-items.hbs", {menu: foundMenu, user: req.session.user})
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })
});



router.get('/add-item', (req, res, next) => {
    res.render('menu/create-item.hbs')
})

router.post('/add-item', (req, res, next) => {

    const { name, description, price, imageUrl } = req.body
  
    Item.create({
      name,
      description,
      price,
      imageUrl
    })
    .then((createdItem) => {
      return Menu.findByIdAndUpdate(
        menuId,
        {
          $push: { items: createdItem._id}
        },
        {new: true}
      )
    })
    .then((updatedMenu) => {
      console.log("Updated Menu", updatedMenu)
      res.redirect("/menu")
    })
    .catch((err) => {
      console.log(err)
      next(err)
    })
  
  })

// router.get("/create-menu", (req, res, next) => {
//     Menu.create({
//       owner: req.session.user._id
//     })
//     .then((createdMenu) => {
//       console.log("Created Menu", createdMenu)
//       res.redirect('/users/profile')
//     })
//     .catch((err) => {
//       console.log("Error creating menu:", err)
//       next(err)
//     })
//   })

router.get('/edit-item/:id', (req, res, next) => {
    Item.findById(req.params.id)
    .then((foundItem) => {
        res.render('menu/edit-item.hbs', foundItem)
    })
    .catch((err) => {
        console.log(err)
        next(err)
      })
     
})

router.post('/edit-item/:id', (req, res, next) => {
    const { name, description, price, imageUrl } = req.body
  
    Item.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        imageUrl
      },
      {new: true}
    )
    .then((updatedItem) => {
      console.log("Updated Item:", updatedItem)
      res.redirect('/menu')
    })
    .catch((err) => {
      console.log(err)
      next(err)
    })
  })

router.get('/delete-item/:id', (req, res, next) => {

    
    Item.findByIdAndDelete(req.params.id)
    .then((deletedItem) => {
      return Menu.findByIdAndUpdate(
        menuId,
        {
          $pull: { items: deletedItem._id}
        },
        {new: true}
      )
    })
    .then((updatedMenu) => {
      console.log("Updated Menu", updatedMenu)
      res.redirect("/menu")
    })
    .catch((err) => {
      console.log(err)
      next(err)
    })
  
  })

module.exports = router;
