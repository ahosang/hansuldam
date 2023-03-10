import { model } from "mongoose";
import { ProductSchema } from "../schemas/product-schema";

const Product = model("products", ProductSchema);

export class ProductModel {
  async totalCount(filterObj) {
    const totalCount = await Product.count(filterObj);
    return totalCount;
  }

  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async findAll(skip, limit) {
    const products = await Product.find().skip(skip).limit(limit);
    return products;
  }

  async findFiltered(skip, limit, sortObj, filterObj) {
    const products = await Product.find(filterObj).sort(sortObj).skip(skip).limit(limit);
    return products;
  }

  async findByObj(Obj) {
    const product = await Product.findOne(Obj);
    return product;
  }

  async findByIdArray(idArray, skip = 0, limit = 0) {
    const products = await Product.find({ _id: { $in: idArray } })
      .sort({
        _id: 1,
      })
      .skip(skip)
      .limit(limit);
    return products;
  }

  async update(filterObj, updateObj) {
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(filterObj, updateObj, option);
    return updatedProduct;
  }

  async updateManyByIdArr(IdArray, toUpdateObj) {
    const filterObj = { _id: { $in: IdArray } };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.updateMany(filterObj, toUpdateObj, option);
    return updatedProduct;
  }

  async delete(productId) {
    const filter = { _id: productId };
    const deletedProduct = await Product.deleteOne(filter);
    return deletedProduct;
  }
}

const productModel = new ProductModel();

export { productModel };
