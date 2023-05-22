import { hotelFixtures } from "fixtures/hotelFixtures";
import { hotelUtils } from "main/utils/hotelUtils";

describe("hotelUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "hotels".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "hotels") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When hotels is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = hotelUtils.get();

            // assert
            const expected = { nextId: 1, hotels: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("hotels", expectedJSON);
        });

        test("When hotels is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = hotelUtils.get();

            // assert
            const expected = { nextId: 1, hotels: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("hotels", expectedJSON);
        });

        test("When hotels is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, hotels: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = hotelUtils.get();

            // assert
            const expected = { nextId: 1, hotels: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When hotels is JSON of three hotels, should return that JSON", () => {

            // arrange
            const threeHotels = hotelFixtures.threeHotels;
            const mockHotelCollection = { nextId: 10, hotels: threeHotels };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockHotelCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = hotelUtils.get();

            // assert
            expect(result).toEqual(mockHotelCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a hotel by id works", () => {

            // arrange
            const threeHotels = hotelFixtures.threeHotels;
            const idToGet = threeHotels[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels: threeHotels }));

            // act
            const result = hotelUtils.getById(idToGet);

            // assert

            const expected = { hotel: threeHotels[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing hotel returns an error", () => {

            // arrange
            const threeHotels = hotelFixtures.threeHotels;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels: threeHotels }));

            // act
            const result = hotelUtils.getById(99);

            // assert
            const expectedError = `hotel with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeHotels = hotelFixtures.threeHotels;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels: threeHotels }));

            // act
            const result = hotelUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one hotel works", () => {

            // arrange
            const hotel = hotelFixtures.oneHotel[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, hotels: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = hotelUtils.add(hotel);

            // assert
            expect(result).toEqual(hotel);
            expect(setItemSpy).toHaveBeenCalledWith("hotels",
                JSON.stringify({ nextId: 2, hotels: hotelFixtures.oneHotel }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing hotel works", () => {

            // arrange
            const threeHotels = hotelFixtures.threeHotels;
            const updatedHotel = {
                ...threeHotels[0],
                name: "Updated Name"
            };
            const threeHotelsUpdated = [
                updatedHotel,
                threeHotels[1],
                threeHotels[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels: threeHotels }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = hotelUtils.update(updatedHotel);

            // assert
            const expected = { hotelCollection: { nextId: 5, hotels: threeHotelsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("hotels", JSON.stringify(expected.hotelCollection));
        });
        test("Check that updating an non-existing hotel returns an error", () => {

            // arrange
            const threeHotels = hotelFixtures.threeHotels;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels: threeHotels }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedHotel = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = hotelUtils.update(updatedHotel);

            // assert
            const expectedError = `hotel with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a hotel by id works", () => {

            // arrange
            const threeHotels = hotelFixtures.threeHotels;
            const idToDelete = threeHotels[1].id;
            const threeHotelsUpdated = [
                threeHotels[0],
                threeHotels[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels: threeHotels }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = hotelUtils.del(idToDelete);

            // assert

            const expected = { hotelCollection: { nextId: 5, hotels: threeHotelsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("hotels", JSON.stringify(expected.hotelCollection));
        });
        test("Check that deleting a non-existing hotel returns an error", () => {

            // arrange
            const threeHotels = hotelFixtures.threeHotels;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels: threeHotels }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = hotelUtils.del(99);

            // assert
            const expectedError = `hotel with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeHotels = hotelFixtures.threeHotels;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, hotels: threeHotels }));

            // act
            const result = hotelUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});