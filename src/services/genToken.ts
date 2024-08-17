import jwt from 'jsonwebtoken';

const generateTokens = (userId: string) => {
    const accessToken = jwt.sign({ userId }, 'access-secret-key', { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, 'refresh-secret-key', { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

export default generateTokens;