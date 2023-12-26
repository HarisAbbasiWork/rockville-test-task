import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IUser, LoginUser, SignupUser, ForgetPassword, ChangePassword, UpdateProfile } from 'src/interface/user.interface';
import { CreateUserDto } from 'src/dto//create-user.dto';
import { LoginUserDto } from 'src/dto//login-user.dto';
import { ForgetPasswordDto } from 'src/dto//forget-password.dto';
import * as otpGenerator from "otp-generator";
import * as nodemailer from "nodemailer";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { UpdateUserProfileDto } from 'src/dto/update-user-profile.dto';
@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<IUser>) { }
    async createUser(createUserDto: CreateUserDto): Promise<SignupUser> {
        console.log("createUserDto ", createUserDto)
        const { email, password } = createUserDto
        const foundUser = await this.userModel.findOne({ email: email });
        if (foundUser) {
            return {
                success: false,
                message: "User already exists."
            }
        }
        console.log("password, saltRounds ", password, process.env.SALTROUNDS)
        const encryptedPassword = await bcrypt.hashSync(password, parseInt(process.env.SALTROUNDS));
        //saving user to DB
        console.log('encryptedPassword', encryptedPassword);
        createUserDto.password = encryptedPassword;
        const newUser = await new this.userModel(createUserDto).save();
        return {
            success: true,
            message: "User has been created successfully",
            user: newUser
        }
    }
    async login(loginUserDto: LoginUserDto): Promise<LoginUser> {
        console.log("loginUserDto ", loginUserDto)
        const { email, password } = loginUserDto
        const foundUser = await this.userModel.findOne({ email: email });
        console.log("foundUser ", foundUser)
        if (!foundUser) {
            return {
                success: false,
                message: "User doesn't exists"
            }
        } else {
            const { _id } = foundUser
            console.log('bycrypt ', await bcrypt.compare(password, foundUser.password));
            console.log("process.env.JWT_SECRET ", process.env.JWT_SECRET, " _id ", _id)
            if (await bcrypt.compare(password, foundUser.password)) {
                const accessToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
                    expiresIn: '1.5h',
                });
                const refreshToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
                    expiresIn: '30d',
                });
                return {
                    success: true,
                    message: "User logged in successfully.",
                    accessToken,
                    refreshToken,
                    user: foundUser
                }
            } else {
                return {
                    success: true,
                    message: "Email and password doesn't match."
                }
            }
        }
    }
    async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<ForgetPassword> {
        console.log("loginUserDto ", forgetPasswordDto)
        const { email } = forgetPasswordDto
        const foundUser = await this.userModel.findOne({ email: email });
        console.log("foundUser ", foundUser)
        if (!foundUser) {
            return {
                success: false,
                message: "User doesn't exists by this email."
            }
        } else {
            const { _id } = foundUser;
            const otp = Math.floor(1000 + Math.random() * 9000);
            console.log(otp);
            console.log("process.env.EMAIL ", process.env.EMAIL)
            console.log("process.env.PASSWORD ", process.env.PASSWORD)
            //Sending Reset OTP to email
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });
            let mailOptions = {
                from: "JobWeb@gmail.com",
                to: email,
                subject: "Reset Password",
                html: `Reset Password OTP: ${otp} `,
            };
            await transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    return console.log("error occurs", err);
                }
            });
            foundUser.resetPasswordOtp = otp;
            await foundUser.save();
            return {
                success: true,
                message: "Forget Password OTP has been sent to your email."
            }
        }
    }
    async changePassword(changePasswordDto: ChangePasswordDto, userId: String): Promise<ForgetPassword> {
        console.log("loginUserDto ", changePasswordDto)
        const { password } = changePasswordDto;
        console.log("password ", password)
        const foundUser = await this.userModel.findOne({ _id: userId });
        console.log("foundUser ", foundUser)
        if (!foundUser) {
            return {
                success: false,
                message: "Invalid OTP"
            }
        } else {
            console.log("password, process.env.SALT_ROUND ", password, parseInt(process.env.SALTROUNDS))
            //Encrypting new password
            let encryptedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUNDS));
            console.log("encryptedPassword: ", encryptedPassword);
            const updatedPassword = await this.userModel.updateOne(
                { _id: foundUser._id },
                {
                    $set: {
                        resetPasswordOtp: null,
                        password: encryptedPassword
                    },
                }
            );
            if (updatedPassword) {
                return {
                    success: true,
                    message: "Password has been updated successfully."
                }
            } else {
                return {
                    success: false,
                    message: "Password couldnt be updated successfully."
                }
            }
        }
    }
    async updateUserProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto): Promise<UpdateProfile> {
        try {
            const updatedProfile = await this.userModel.findByIdAndUpdate(
                userId,
                { $set: updateUserProfileDto },
                { new: true },
            );

            if (!updatedProfile) {
                return {
                    success: false,
                    message: "User not exists."
                };
            }

            return {
                success: true,
                message: "Profile has been updated successfully",
                user: updatedProfile
            };
        } catch (error) {
            console.log("error ",error)
            throw new Error('Failed to update user profile');
        }
    }
}
