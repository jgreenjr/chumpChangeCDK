export interface IChores {
    activity: string;
    notes: string;
    date: Date;
    amount: Number;
    whoFrom: string;
    whoTo: string;
}

export interface IUser{
    id: string;
    name: string;
}