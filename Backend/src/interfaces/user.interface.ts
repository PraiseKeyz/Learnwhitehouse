export interface IUser {
    _id: string;
    firstname: string;
    surname: string;
    middlename?: string;
    email: string;
    currentLevel: string;
    phone: string;
    password: string;
    department: string;
    role: 'admin' | 'student';
    adminSecretKey?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    verificationToken?: string | null; 
    verified?: boolean;
}