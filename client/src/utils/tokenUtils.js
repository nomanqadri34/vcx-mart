// Token utility functions
export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        return true;
    }
};

export const getTokenInfo = (token) => {
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            userId: payload.userId,
            exp: payload.exp,
            iat: payload.iat,
            isExpired: payload.exp < Date.now() / 1000
        };
    } catch (error) {
        return null;
    }
};

export const clearExpiredToken = () => {
    const token = localStorage.getItem('accessToken');
    if (token && isTokenExpired(token)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return true;
    }
    return false;
};