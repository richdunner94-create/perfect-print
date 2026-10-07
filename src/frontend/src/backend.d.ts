import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    status: BookingStatus;
    serviceType: string;
    name: string;
    createdAt: bigint;
    email: string;
    preferredDate: string;
    notes: string;
    preferredTime: string;
    phone: string;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface ContactMessage {
    id: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    message: string;
    phone: string;
}
export interface DashboardCounts {
    contactMessages: bigint;
    pendingAppointments: bigint;
    posts: bigint;
    totalAppointments: bigint;
    services: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Post {
    id: bigint;
    title: string;
    body: string;
    published: boolean;
    createdAt: bigint;
    imageUrl?: string;
    category: PostCategory;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Service {
    id: bigint;
    title: string;
    active: boolean;
    createdAt: bigint;
    description: string;
    imageUrl?: string;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface VisaDetails {
    title: string;
    country: VisaCountry;
    fees: string;
    description: string;
    processingInfo: string;
    requirements: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum PostCategory {
    advertising = "advertising",
    announcement = "announcement",
    promotion = "promotion"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VisaCountry {
    usa = "usa",
    china = "china",
    france = "france"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(name: string, phone: string, email: string, serviceType: string, preferredDate: string, preferredTime: string, notes: string): Promise<bigint>;
    createPost(title: string, body: string, imageUrl: string | null, category: PostCategory, published: boolean): Promise<bigint>;
    createService(title: string, description: string, imageUrl: string | null, active: boolean): Promise<bigint>;
    deleteBooking(id: bigint): Promise<boolean>;
    deleteContactMessage(id: bigint): Promise<boolean>;
    deletePost(id: bigint): Promise<boolean>;
    deleteService(id: bigint): Promise<boolean>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardCounts(): Promise<DashboardCounts>;
    getPost(id: bigint): Promise<Post | null>;
    getService(id: bigint): Promise<Service | null>;
    getVisa(country: VisaCountry): Promise<VisaDetails | null>;
    isCallerAdmin(): Promise<boolean>;
    listBookings(): Promise<Array<Booking>>;
    listContactMessages(): Promise<Array<ContactMessage>>;
    listPosts(): Promise<Array<Post>>;
    listServices(): Promise<Array<Service>>;
    listVisas(): Promise<Array<VisaDetails>>;
    schema(): Promise<string>;
    submitContactMessage(name: string, email: string, phone: string, message: string): Promise<bigint>;
    updateBookingStatus(id: bigint, status: BookingStatus): Promise<boolean>;
    updatePost(id: bigint, title: string, body: string, imageUrl: string | null, category: PostCategory, published: boolean): Promise<boolean>;
    updateService(id: bigint, title: string, description: string, imageUrl: string | null, active: boolean): Promise<boolean>;
    updateVisa(country: VisaCountry, title: string, description: string, requirements: string, processingInfo: string, fees: string): Promise<boolean>;
}
