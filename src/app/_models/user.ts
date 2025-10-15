export interface User
{
    userId:  number;
    fullName: string;
    email: string;
    mobileNumber: string;
    role: string;
    isActive: number;
    photoId: number | undefined;
    photoUrl: string | undefined;
    publicId: string | undefined;
    token: string
}