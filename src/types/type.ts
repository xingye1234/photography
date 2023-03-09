export interface IArticleInfo{
    address:string,
    article_id:number, 
    avatar:string,
    comment_count: number,
    create_time: string,
    description: string,
    good: number,
    img:string,
    title:string,
    user_id: number,
    username: string,
    isFollow?:boolean
}

export interface IUserInfo{
    address:string,
    article_count:number,
    avatar:string,
    birthday:string,
    chat:string,
    cover:string,
    create_time:string,
    description:string,
    email:string,
    followee_count:number,
    follower_count:number,
    nick_name:string,
    password:string,
    phone:string,
    qq:string,
    sex:string,
    user_id:number,
    username:string
}