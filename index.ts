import { AppDataSource} from "./src/data-source";
import { Product} from "./src/entity/Products";
import express, {response} from 'express';
import bodyParser from "body-parser";

const PORT = 3333;

AppDataSource.initialize().then(async connection=>{
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}))
    const ProductRepo = connection.getRepository(Product);

    app.post('/product/create', async (req : any,res : any)=>{
        try{
            const productSearch = await ProductRepo.findOneBy({name:req.body.name})
            if (productSearch){
                res.status(500).json({
                    message: "Sản phẩm đã tồn tại"
                })
            }
            console.log(req.body)
            const productData = {
                name : req.body.name,
                avatar: req.body.avatar,
                author : req.body.author,
                price : req.body.price
            }
            const product = await ProductRepo.save(productData)
            if (product){
                res.status(200).json({
                    message: "Create product success",
                    product : product
                })
            }
        } catch (e) {
            res.status(500).json({
                message : e.message
            })
        }
    })

    app.put('/product/update', async (req,res)=>{
        try {
            let productSearch = await ProductRepo.findOneBy({id : req.body.id})
            if (!productSearch){
                res.status(500).json({
                    message: "Sản phẩm không tồn tại"
                })
            }
            const product = await ProductRepo.update({id:req.body.id}, req.body)
            res.status(200).json({
                message: "Update product success",
            })
        } catch (e){
            res.status(500).json({
                message : e.message
            })
        }
    })

    app.delete("/product/delete", async (req,res)=>{
        try {
            let productSearch = await ProductRepo.findOneBy({id:req.body.id})
            if (!productSearch){
                res.status(500).json({
                    message: "Sản phẩm không tồn tại"
                })
            }
            const product = await ProductRepo.delete({id:req.body.id})
            res.status(200).json({
                message: "Delete product success",
            })
        } catch (e){
            res.status(500).json({
                message : e.message
            })
        }
    })

    app.get("/product/list", async (req,res)=>{
        try {
            const products = await ProductRepo.find()
            if (products){
                res.status(200).json({
                    message : 'Sucess',
                    products : products
                })
            }
        }catch (e){
            res.status(500).json({
                message : e.message
            })
        }
    })

    app.get('/product/detail', async (req,res)=>{
        try {
            let productId = parseInt(req.query.productId as string)
            const  product = await ProductRepo.findOneBy({id : productId})
            if (product){
                res.status(200).json({
                    message : 'Sucess',
                    product
                })
            }
        }catch (e){
            res.status(500).json({
                message : e.message
            })
        }
    })

    app.listen(PORT, ()=>{
        console.log('server running')
    })
})