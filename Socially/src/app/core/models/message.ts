export interface IMessage {
    message: string[]
    messageType: string
    readAt: Date
    sender: string
    sentAt: Date
    _id: string
}

export interface MessageThread {
    lastUpdated: Date
    message: IMessage[]
    participants: string[]
    __v: number
    _id: string
}