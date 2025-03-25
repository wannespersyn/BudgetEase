import { LoginInput } from "../types/auth.types";
import User from "../domain/model/user";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../util/jwt";
import { Response, Request } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';


/**
 * Authenticates a user and sends a JWT token in a cookie
 * 
 * @param email
 * @param password
 * @param res 
 */
const authenticate = async ({ email, password }: LoginInput, res: Response): Promise<void> => {
    const user = await getSpecificUser(email);

    validateUser(user, password);

    const token = generateJwtToken({ email: user.email, admin: user.admin, userId: user.id });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ email: user.email, admin: user.admin, id: user.id });
};


/**
 * Logs out a user by clearing the JWT cookie
 * 
 * @param res 
 */
const logout = async (res: Response) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/"
    });

    res.status(200).json({ message: "Logged out successfully" });
};


/**
 * Signs up a user
 * 
 * @param userData 
 * @returns 
 */
const signUp = async (userData: { name: string, email: string, password: string, admin: boolean }) => {
    try {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User({
            ...userData,
            password: hashedPassword
        });

        const savedUser = await user.save();

        const { password, ...userWithoutPassword } = savedUser.toObject();
        return userWithoutPassword;
    } catch (error) {
        console.error(error);
        throw new Error('Error signing up');
    }
};

/**
 * Gets a specific user by email
 * 
 * @param email 
 * @returns 
 */
const getSpecificUser = async (email: string) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }   

        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching user');
    }
};

const getUser = async (req: Request, res: Response) => {
    try {
        const token = req.cookies['jwt'] || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, token is missing" });
        }

        // Decode the token
        let decodedToken: JwtPayload | string;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Check if decodedToken is a string or JwtPayload, and access userId only if it's JwtPayload
        if (typeof decodedToken === 'object' && decodedToken !== null) {
            const userId = decodedToken.userId;
            if (!userId) {
                return res.status(401).json({ message: "Invalid token data, userId missing" });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const { password, ...userWithoutPassword } = user.toObject();
            return res.status(200).json(userWithoutPassword);
        } else {
            return res.status(401).json({ message: "Invalid token format" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user" });
    }
}

const validateUser = async (user: any, password: string) => {
    if (!user) {
      throw new Error("User not found!");
    }
  
    if (!user.password) {
      throw new Error("User password is missing!");
    }
  
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Password is incorrect!");
    }
  
    if (user.id === undefined) {
      throw new Error("User ID is undefined!");
    }
  
    return user;
  };


export default {
    authenticate,
    signUp,
    logout,
    getUser
};