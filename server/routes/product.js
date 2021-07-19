const express = require('express');
const router = express.Router();
const { Product } = require("../models/Product");
const multer = require('multer')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

let upload = multer({ storage: storage }).single('file')

//=================================
//             Product
//=================================


router.post("/image", (req, res) => {

    //가져온 이미지를 저장을 해준다.
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

});

router.post("/", (req, res) => {

    //받아온 정보들을 DB에 넣어 준다.
    const product = new Product(req.body)

    product.save(err => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })

});


router.post("/products", (req, res) => {

    //Product collection안에 들어있는 모든 상품 정보를 가져오기

    let limit = req.body.limit ? parseInt(req.body.limit) : 20
    let skip = req.body.skip ? parseInt(req.body.skip) : 0
    let term = req.body.searchTerm

    let findArgs = {}

    for (let key in req.body.filters) {

        if (req.body.filters[key].length > 0) {

            if (key == "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }

        }

    }

    console.log('findArgs', findArgs);

    if (term) {
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({
                    success: true, productInfo,
                    postSize: productInfo.length
                })
            })
    } else {
        Product.find(findArgs)
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({
                    success: true, productInfo,
                    postSize: productInfo.length
                })
            })
    }

});


router.get("/products_by_id", (req, res) => {

    //주소창의 ?뒤에 오는 것을 쿼리라 하고 그것을 가져오기 위해서
    //req.body가 아닌 req.query로 불러와야 한다. 
    let type = req.query.type
    let productIds = req.query.id

    if (type == 'array') {
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }

    //  productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.

    Product.find({ _id: { $in: productIds } })
        .populate('writer')
        .exec((err, product) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
});



module.exports = router;
