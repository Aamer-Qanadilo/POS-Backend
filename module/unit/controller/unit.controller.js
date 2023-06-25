import axios from "axios";
import { unitModel } from "../../../DB/model/unit.model.js";

const getAllUnits = async (req, res) => {
  const units = await unitModel.find({});

  res.json({ message: "success", data: units });
};

const getUnit = async (req, res) => {
  const { id } = req.params;

  try {
    const unit = await unitModel.findById(id);

    if (unit) {
      return res.status(201).json({ message: "success", data: unit });
    } else {
      return res.status(404).json({ message: "unit not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong, please check your inputs" });
  }
};

const addUnit = async (req, res) => {
  const { name, baseUnit, conversionFactor } = req.body;

  const prevUnit = await unitModel.findOne({ name, baseUnit });

  if (prevUnit) {
    res.json({ message: "already existing unit" });
  } else {
    const newUnit = new unitModel({
      name,
      baseUnit,
      conversionFactor,
    });

    newUnit
      .save()
      .then((result) => {
        res.status(201).json({
          message: "success",
          data: {
            _id: result._id,
            name,
            baseUnit,
            conversionFactor,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "failed",
          error: err,
        });
      });
  }
};

const updateUnit = async (req, res) => {
  const { id, conversionFactor } = req.body;

  try {
    const prevUnit = await unitModel.findOne({ _id: id });

    if (prevUnit) {
      await unitModel.findOneAndUpdate({ _id: id }, { conversionFactor });

      return res.status(201).json({
        message: "success",
        data: {
          _id: prevUnit._id,
          name: prevUnit.name,
          baseUnit: prevUnit.baseUnit,
          conversionFactor,
        },
      });
    } else {
      res.json({ message: "invalid inputs" });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong, please check your inputs",
      error,
    });
  }
};

const deleteUnit = async (req, res) => {
  const { id } = req.params;

  const baseUrl = process.env.BASEURL;

  const productsUrl =
    req.protocol + "://" + req.get("host") + baseUrl + "/product/getByUnit/";

  try {
    const { data } = await axios.get(productsUrl + id);

    if (data.message === "success") {
      return res.json({
        message: "failed",
        error: "can't delete, unit is used by products",
      });
    }
  } catch (error) {
    // Do nothing, this means that the entered unit id isn't related to any product
  }

  try {
    const deletedUnit = await unitModel.findByIdAndDelete(id);

    if (deletedUnit) {
      res.status(201).json({ message: "success", data: deletedUnit });
    } else {
      res.status(404).json({ message: "invalid id" });
    }
  } catch (error) {
    res.status(500).json({
      message: "something went wrong, please check your inputs",
      error,
    });
  }
};

export default { getAllUnits, getUnit, addUnit, updateUnit, deleteUnit };
