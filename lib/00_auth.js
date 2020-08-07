module.exports = {
    IsOwner:function(request, response){
        if(request.session.is_logined){
            return true;
        }
        else{
            return false;
        }
    },

    StatusUi:function(request, response){
        var authStatusUi = `<a href="/auth/login">login</a>`;
    if(this.IsOwner(request, response)){
        authStatusUi = `${request.session.nickname} | <a href="/auth/logout">logout</a>`;
    }
    return authStatusUi;
    }
}

