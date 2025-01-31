export class SuccessResponse{
    constructor(
        statusCode,
        data,
        message
    ){
        this.statusCode=statusCode
        this.data=data
        this.message=message
    }
}
