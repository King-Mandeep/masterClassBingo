const todosKey="StdMngmnt";
export const getLocalStorageSocialData=()=>{
    const rawStdMngmnt=localStorage.getItem(todosKey);
    if(!rawStdMngmnt)return null;
    return JSON.parse(rawStdMngmnt);
    // return(rawSocial);
};

export const setLocalStorageSocialData=(task)=>{
    // console.log(task);
    
   return localStorage.setItem(todosKey,JSON.stringify(task));
}