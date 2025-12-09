import {test} from "../utils/fixtures";
import {expect} from "../utils/customExpect";


[
    {userName: "dd", errorMessage: "is too short (minimum is 3 characters)"},
    {userName: "ddd", errorMessage: ""},
    {userName: "dddddddddddddddddddd", errorMessage: ""},
    {userName: "ddddddddddddddddddddd", errorMessage: "is too long (maximum is 20 characters)"}
].forEach(({userName, errorMessage}) => {
    test(`Error messages validation for ${userName}`, async ({api}) => {
        const newUserResponse = await api
            .body({
                "user": {
                    "email": "",
                    "username": userName,
                    "password": "d"
                }
            })
            .path("/users")
            .clearAuth()
            .postRequest(422);

        if (userName.length === 3 || userName.length === 20) {
            expect(newUserResponse.errors).not.toHaveProperty("username");
        } else {
            expect(newUserResponse.errors.username[0]).shouldEqual(errorMessage);
        }
    });
})
