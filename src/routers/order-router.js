import { Router } from "express";
import is from "@sindresorhus/is";

import { orderService } from "../services";

const orderRouter = Router();

// 주문 추가 - userId false로 설정하면 선택으로 들어가고 안들어가고가 될듯?
orderRouter.post("/", async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    // req (request)의 body 에서 데이터 가져오기
    const {
        fullName,
        address,
        shipping,
        paymentMethod,
        paymentDetail,
        priceSum,
        productList,
        userId,
        phoneNumber,
    } = req.body;
    // 위 데이터를 주문 db에 추가하기
    const newOrder = await orderService.addOrder({
        fullName,
        address,
        shipping,
        paymentMethod,
        paymentDetail,
        priceSum,
        productList,
        userId,
        phoneNumber,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 주문 수정 구매자
orderRouter.patch("/:orderId", async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const { orderId } = req.params;

    const {
      fullName,
      productList,
      phoneNumber,
      address,
      paymentMethod,
      paymentDetail,
    } = req.body;

    // 위 데이터를 카테고리 db에 추가하기
    const updateOrder = await orderService.updateOrder(orderId, {
      fullName,
      productList,
      phoneNumber,
      address,
      paymentMethod,
      paymentDetail,
    });
    res.status(200).json(updateOrder);
  } catch (error) {
    next(error);
  }
});

// 주문 취소 구매자
orderRouter.delete("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await orderService.deleteOrder(orderId);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// 전체 주문 목록을 가져옴 -안쓰일건지?
orderRouter.get("/", async (req, res, next) => {
  try {
    // 전체 주문 목록을 얻음
    const order = await orderService.getOrders();

    // 주문 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// 주문 상세 정보를 가져옴 
orderRouter.get("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await orderService.getOrderById(orderId);

    // 주문 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };