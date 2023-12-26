import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { ForgetPasswordDto } from 'src/dto//forget-password.dto';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { } from 'src/dto//forget-password.dto';
import { UpdateUserProfileDto } from 'src/dto/update-user-profile.dto';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post('/signup')
    async createUser(@Res() response, @Body() createUserDto: CreateUserDto) {
        try {
            const newUser = await this.userService.createUser(createUserDto);
            return response.status(HttpStatus.CREATED).json({
                message: 'User has been created successfully',
                newUser,
            })
        } catch (err) {
            console.log("err ", err)
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: 500,
                message: 'Error: User not created!',
                error: 'Bad Request'
            })
        }
    }
    @Post('/login')
    async loginUser(@Res() response, @Body() loginUserDto: LoginUserDto) {
        try {
            const loginUserResponse = await this.userService.login(loginUserDto)
            console.log("loginUserResponse ", loginUserResponse)
            return response.status(HttpStatus.CREATED).json(loginUserResponse)
        } catch (err) {
            console.log("err ", err)
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: 500,
                message: 'Error: Internal Server Error!',
                error: 'Bad Request'
            })
        }
    }
    @Post('/changepassword')
    async changePassword(@Req() req: any, @Res() response, @Body() changePasswordDto: ChangePasswordDto) {
        try {
            const userId = req.user;
            const changePasswordResponse = await this.userService.changePassword(changePasswordDto, userId)
            console.log("changePasswordResponse ", changePasswordResponse)
            return response.status(HttpStatus.CREATED).json(changePasswordResponse)
        } catch (err) {
            console.log("err ", err)
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: 500,
                message: 'Error: Internal Server Error!',
                error: 'Bad Request'
            })
        }
    }
    @Put('/')
    async updateUserProfile(
        @Req() request: any,
        @Res() response,
        @Body() updateUserProfileDto: UpdateUserProfileDto,
    ) {
        try {
            const userId = request.user;
            const updatedProfileResponse = await this.userService.updateUserProfile(userId, updateUserProfileDto);
            return response.status(HttpStatus.OK).json({
                message: 'User profile updated successfully',
                updatedProfileResponse,
            });
        } catch (err) {
            console.log('err ', err);
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: 500,
                message: 'Error: Internal Server Error!',
                error: 'Bad Request',
            });
        }
    }
}