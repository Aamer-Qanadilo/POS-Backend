import axios from "axios";

const validateProduct = async (req, res, next) => {
  const { productId } = req.body;

  try {
    const baseUrl = process.env.BASEURL;

    const productUrl =
      req.protocol + "://" + req.get("host") + baseUrl + "/product/";

    const { data } = await axios.get(productUrl + productId, {
      headers: {
        authorization:
          "foothill__eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTg5NmU0NzRkMWNlMGU4NDFhOTJlMiIsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTY4Nzc2NzIyNH0.SdrohllCDZfCcQy_pg2n0oALHtvd2z7UUxOI1rKNDLs",
      },
    });

    // console.log(data, productUrl, productId, req.user);

    if (data.message === "success") {
      next();
    } else {
      res.status(404).json({ message: "invalid product id" });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong, please check your inputs",
      error,
    });
  }
};

export default { validateProduct };
