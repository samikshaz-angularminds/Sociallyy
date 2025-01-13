export interface IPost{
_id: string
accountHolderId: string
accountHolderName: string
caption: string
createdAt: string
likes: string[]
media: IMedia[]
}

export interface IMedia{
    _id: string
    public_id: string
    url: string
}