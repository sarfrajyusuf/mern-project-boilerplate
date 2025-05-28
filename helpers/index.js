import User from "../schema/userSchema.js"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        console.log(user,"=======================")
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        console.log(accessToken, "==========ACCESS TOKEN=============", refreshToken)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

export { generateAccessAndRefereshTokens }