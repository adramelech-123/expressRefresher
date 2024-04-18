import { mockUsers } from "../utils/constants.mjs";
import { validationResult, matchedData} from "express-validator";
import { hashPassword } from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

export const getUserByIdHandler = (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];

  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
};

export const createUserHandlerX = async (request, response) => {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    return response.status(400).send({ errors: result.array() });
  }

  const newUserData = matchedData(request);
  newUserData.password = hashPassword(newUserData.password);

  const newUser = new User(newUserData);

  try {
    const savedUser = await newUser.save();
    return response.status(201).send(savedUser);
  } catch (error) {
    return response.sendStatus(400);
  }
};