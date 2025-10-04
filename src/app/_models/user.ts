export interface User
{
    userId:  number;
    fullName: string;
    email: string;
    photoId: number | undefined;
    photoUrl: string | undefined;
    publicId: string | undefined;
    token: string
}