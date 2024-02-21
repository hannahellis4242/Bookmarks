import {z} from "zod";

export const UserSchema = z.object({
    name:z.string().min(1),
    password:z.string().min(8),
});

type User = z.infer<typeof UserSchema>;
export default User;