"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./src/data-source");
const Products_1 = require("./src/entity/Products");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = 3333;
data_source_1.AppDataSource.initialize().then(async (connection) => {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    const ProductRepo = connection.getRepository(Products_1.Product);
    app.post('/product/create', async (req, res) => {
        try {
            const productSearch = await ProductRepo.findOneBy({ name: req.body.name });
            if (productSearch) {
                res.status(500).json({
                    message: "Sản phẩm đã tồn tại"
                });
            }
            console.log(req.body);
            const productData = {
                name: req.body.name,
                avatar: req.body.avatar,
                author: req.body.author,
                price: req.body.price
            };
            const product = await ProductRepo.save(productData);
            if (product) {
                res.status(200).json({
                    message: "Create product success",
                    product: product
                });
            }
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    });
    app.put('/product/update', async (req, res) => {
        try {
            let productSearch = await ProductRepo.findOneBy({ id: req.body.id });
            if (!productSearch) {
                res.status(500).json({
                    message: "Sản phẩm không tồn tại"
                });
            }
            const product = await ProductRepo.update({ id: req.body.id }, req.body);
            res.status(200).json({
                message: "Update product success",
            });
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    });
    app.delete("/product/delete", async (req, res) => {
        try {
            let productSearch = await ProductRepo.findOneBy({ id: req.body.id });
            if (!productSearch) {
                res.status(500).json({
                    message: "Sản phẩm không tồn tại"
                });
            }
            const product = await ProductRepo.delete({ id: req.body.id });
            res.status(200).json({
                message: "Delete product success",
            });
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    });
    app.get("/product/list", async (req, res) => {
        try {
            const products = await ProductRepo.find();
            if (products) {
                res.status(200).json({
                    message: 'Sucess',
                    products: products
                });
            }
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    });
    app.get('/product/detail', async (req, res) => {
        try {
            let productId = parseInt(req.query.productId);
            const product = await ProductRepo.findOneBy({ id: productId });
            if (product) {
                res.status(200).json({
                    message: 'Sucess',
                    product
                });
            }
        }
        catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    });
    app.listen(PORT, () => {
        console.log('server running');
    });
});
//# sourceMappingURL=index.js.map