import { Address } from "./address.model";

export interface User {
    id: string;
    name: string
    email: string
    password?: string
    dob?: string
    gender?: string
    phone?: string
    profilePicture?: string
    address?: Address
    roles: string[]
}