import { Router } from "express";

import { productService } from "../services";

const productRouter = Router();


// 전체 상품 목록을 가져옴 (배열 형태)
productRouter.get("/", async (req, res, next) => {
  try {
    // 전체 상품 목록을 얻음
    const products = await productService.getProducts();

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 상품 상세 정보를 가져옴
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    console.log(productId)
    const product = await productService.getProductById(productId);
    console.log(product)

    // 상품 목록을 JSON 형태로 프론트에 보냄
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
