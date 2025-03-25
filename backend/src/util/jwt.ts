import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateJwtToken = ({
    email,
    admin,
    userId,
}: { email: string; admin: boolean; userId: string }): string => {  
    
    // Parse the JWT_EXPIRES_HOURS from the .env file
    const expiresIn = parseInt(process.env.JWT_EXPIRES_HOURS ?? '1', 10);
    
    // Configure the JWT options
    const options = {
        issuer: 'web manager',
        expiresIn: expiresIn * 3600,
    };

    // Create the payload
    const payload = { email, admin, userId };

    const secret = process.env.JWT_SECRET as string;

    // Generate the JWT token
    try {
        return jwt.sign(payload, secret, options);
    } catch (err) {
        console.error(err);
        throw new Error('Error generating JWT token, see server logs for more details');
    }
}

export { generateJwtToken };
