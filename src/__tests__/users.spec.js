import validator from "express-validator"
import { getUserByIdHandler, createUserHandlerX } from "../handlers/users.mjs"
import { mockUsers } from "../utils/constants.mjs"
import * as helpers from "../utils/helpers.mjs"
import { User } from "../mongoose/schemas/user.mjs"

// Mock validationResult from express-validator
jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{"msg": "This is a message"}])
    })),

    matchedData: jest.fn(() => ({
        username: "test",
        displayName: "testName",
        password: "password"
    }))
}))

// We want to mock the hashedPassword which is located in the helpers.mjs file
jest.mock('../utils/helpers.mjs', () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`)
}))

jest.mock('../mongoose/schemas/user.mjs')

const mockRequest = {
    findUserIndex: 1
}
const mockResponse = {
    sendStatus: jest.fn(),
    send: jest.fn(),
    status: jest.fn(() => mockResponse)
}

describe('Get Users', () => {
    it('should get user by id', () => {
        getUserByIdHandler(mockRequest, mockResponse)
        expect(mockResponse.send).toHaveBeenCalled()
        expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[1]);
        expect(mockResponse.send).toHaveBeenCalledTimes(1)
    })

    it('should call sendStatus with 404 when user not found', () => {
        const copyMockRequest = { ...mockRequest, findUserIndex: 100}
        getUserByIdHandler(copyMockRequest, mockResponse)
        expect(mockResponse.sendStatus).toHaveBeenCalled()
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404)
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
        expect(mockResponse.send).not.toHaveBeenCalled();
    })
})

describe('Create Users', () => {
    const mockRequest = {}

    it('should return status 400 when there are errors', async () => {
        await createUserHandlerX(mockRequest, mockResponse)
        expect(validator.validationResult).toHaveBeenCalled()
        expect(validator.validationResult).toHaveBeenCalledWith(mockRequest)
        expect(mockResponse.status).toHaveBeenCalledWith(400)
        expect(mockResponse.send).toHaveBeenCalledWith(
          {"errors": [{ msg: "This is a message" }]}
        );
    })

    it('should return status 201 and the created user', async () => {
        // In this case isEmpty has to be true, so we can use spyOn method to change the value of isEmpty to true from false declared above
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true)
        }))

        const saveMethod = jest
          .spyOn(User.prototype, "save")
          .mockResolvedValueOnce({
            id: 1,
            username: "test",
            displayName: "testName",
            password: "hashed_password",
          });

        await createUserHandlerX(mockRequest, mockResponse)

        expect(validator.matchedData).toHaveBeenCalledWith(mockRequest)

        expect(helpers.hashPassword).toHaveBeenCalledWith("password")
        expect(helpers.hashPassword).toHaveReturnedWith("hashed_password")

        expect(User).toHaveBeenCalledWith({
          username: "test",
          displayName: "testName",
          password: "hashed_password",
        });

        // expect(User.mock.instances[0].save).toHaveBeenCalled()
        expect(saveMethod).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.send).toHaveBeenCalledWith({
          id: 1,
          username: "test",
          displayName: "testName",
          password: "hashed_password",
        });
    })

    it('should send status of 400 when db fails to save user', async () => {
        jest
          .spyOn(validator, "validationResult")
          .mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true),
          }));

        const saveMethod = jest
          .spyOn(User.prototype, "save")
          .mockImplementationOnce(() => Promise.reject("Failed to save user")) 

        await createUserHandlerX(mockRequest, mockResponse) 

        expect(saveMethod).toHaveBeenCalled()
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
    })
})