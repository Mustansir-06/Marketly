import {TokenPayload} from "../utils/auth.ts"
declare global{
    namespace Express{
        interface Request{
            user?:TokenPayload,
            token?: string;
        }
    }
}
export {}