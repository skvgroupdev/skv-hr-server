declare const _default: () => {
    port: number;
    mongo: {
        uri: string;
    };
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
    cors: {
        origin: string;
    };
};
export default _default;
