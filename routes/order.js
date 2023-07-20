var express = require('express');
var router = express.Router();

const Order = require('../models/Order')

const isLoggedIn = require('../middleware/isLoggedIn')

/* GET home page. */
router.get('/', function (req, res, next) {
    Menu.findById(menuId)
        .populate("items")
        .then((foundMenu) => {
            console.log("Found menu", foundMenu, req.session.user)
            res.render("menu/all-items.hbs", { menu: foundMenu, user: req.session.user })
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
});

router.post("/add-item/:id", isLoggedIn, (req, res, next) => {
    const id = req.params.id
    const order = req.session.order
    console.log(req.session)
    if (!order) {
        Order.create({ owner: req.session.user._id })
        .then((createdOrder) => {
            createdOrder.items.push(id)
            req.session.order = createdOrder._id
           
            return createdOrder.save()
        })
        .then(() => {
            res.redirect("/menu")
        })
            .catch((err) => {
                console.log(err)
                next(err)
            })
    } else {
        Order.findByIdAndUpdate(order, { $push: { items: id } }, { new: true })
        .then((updatedOrder) => {
            res.redirect("/menu")
        })
            .catch((err) => {
                console.log(err)
                next(err)
            })
    }
})

router.get('/add-item/:id', (req, res, next) => {
    res.render('order/create-item.hbs')
})

router.get('/edit-item/:id', (req, res, next) => {

    Order.findById(req.params.orderId)
    .then((foundOrder) => {
        console.log("Found Order", foundOrder)
        res.render('order/order-cart.hbs', foundOrder)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.post('/edit-item/:id', (req, res, next) => {
    const id = req.params.id
    const order = req.session.order

   if (order) {
    Order.findByIdAndUpdate(req.params.orderId)
    .then((updatedOrder) => {
        res.redirect(`/order/order-cart.hbs/${updatedOrder._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
   }
})

router.get('/delete-item/:orderId', (req, res, next) => {
    
    Order.findByIdAndDelete(req.params.orderId)
    .then((deletedOrder) => {
        console.log("Deleted order:", deletedOrder)
        res.redirect('/order/order-cart.hbs')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/order-details', (req, res, next) => {
    Order.findById(req.session.order)
    .populate('items')
    .then((foundOrder) => {
        console.log('Found order', foundOrder)
        res.render('order/order-cart.hbs', foundOrder)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/remove-item/:id', isLoggedIn, (req, res, next) => {
    console.log("order", req.session)
    Order.findByIdAndUpdate(
        req.session.order,
        {
          $pull: {items: req.params.id}
        }, 
        {new: true}
        )
        .then((updatedOrder) => {
          console.log('Updated Order', updatedOrder)
          res.redirect('/order/order-details')
        })
        .catch((err) => {
          console.log(err)
          next(err)
        })
})

router.get('/delete-order/:id', (req, res , next)=> {
    req.session.order = null
    Order.findByIdAndDelete(req.params.id)
    .then((deletedOrder) => {
        console.log('Deleted order', deletedOrder)
        res.redirect('/order/order-details')
    })
    .catch((err) => {
        console.log(err)
        next(err)
      })
})

module.exports = router;
