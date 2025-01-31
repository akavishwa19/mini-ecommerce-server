import Product from "../Models/product.model.js";
import { SuccessResponse } from "../Utils/successResponse.js";
import { ErrorResponse } from "../Utils/errorrResponse.js";
import cryptoRandomString from "crypto-random-string";
import { convert } from "url-slug";

const add = async (req, res) => {
  try {
    const code = cryptoRandomString({ length: 8, type: "alphanumeric" });
    req.body.product_code = code;
    const slug = convert(req.body.name, { camelCase: false });
    req.body.slug = slug;
    const data = new Product(req.body);
    await data.save();

    return res
      .status(200)
      .json(new SuccessResponse(200, data, "Product added succesfully"));
  } catch (error) {
    console.log(error);
    if ((error.code = "11000")) {
      return res
        .status(500)
        .json(new ErrorResponse(500, "Product already exists"));
    }
    return res.status(500).json(new ErrorResponse(500, error?.message));
  }
};

const edit = async (req, res) => {
  try {
    const slug = convert(req.body.name, { camelCase: false });
    req.body.slug = slug;

    await Product.findByIdAndUpdate(req.query.id, req.body);

    return res
      .status(200)
      .json(new SuccessResponse(200, null, "Product edited succesfully"));
  } catch (error) {
    console.log(error);
    if ((error.code = "11000")) {
      return res
        .status(500)
        .json(new ErrorResponse(500, "Product already exists"));
    }
    return res.status(500).json(new ErrorResponse(500, error?.message));
  }
};

const remove = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.query.id);
    return res
      .status(200)
      .json(new SuccessResponse(200, null, "Product deleted succesfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ErrorResponse(500, error?.message));
  }
};

const fetch = async (req, res) => {
  try {

    const data=await Product.find();
    return res
    .status(200)
    .json(new SuccessResponse(200, data, "Product fetched succesfully"));

  } catch (error) {
    console.log(error);
    return res.status(500).json(new ErrorResponse(500, error?.message));
  }
};

const ssr = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const filter = req.query.filter || "";
    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder || "asc";

    let filterQuery = {};
    if (filter) {
      const regex = new RegExp(filter, "i");
      filterQuery = {
        name: { $regex: regex },
      };
    }

    const totalRecords = await Product.countDocuments(filterQuery);

    const sortOptions = {};
    sortOptions[sortField] = sortOrder === "desc" ? -1 : 1;

    const data = await Product.find(filterQuery)    
      .skip((page - 1) * size)
      .limit(size)
      .sort(sortOptions);

    return res
      .status(200)
      .json(
        new SuccessResponse(200, { totalRecords, data }, "Fetched all responses")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const single= async (req,res)=>{
  try {

    const data=await Product.findById(req.query.id);
    return res
      .status(200)
      .json(
        new SuccessResponse(200, data, "Fetched single response")
      );
    
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
}


export { add, edit, remove, fetch , ssr , single};
