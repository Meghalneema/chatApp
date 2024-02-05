import axios from 'axios'

const baseUrl = "http://localhost:5001";
// const baseUrl="https://chatapp-socketio-iuu9.onrender.com";


const registerUser = async (name, email, password,  pic, config)=>{
    try {
        const response= await axios.post(`${baseUrl}/registerUser`, { name, email, password,  pic, },config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("error fetchChat-- ", error);
        throw new Error("Registration failed");
    }
}

const authUser = async (name, email, password, config)=>{
    try {
        const response= await axios.post(`${baseUrl}/login`, { name, email, password},config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("error fetchChat-- ", error);
        throw new Error("Registration failed");
    }
}

const accessChat = async (userId, config)=>{
    try {
        const response= await axios.post(`${baseUrl}/`, { userId},config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("error accessChat-- ", error);
        throw new Error("accessChat failed");
    }

    // chatRouter.route("/").post(protect,accessChat);
    // {
    //   "userId":"65aa497e7b0c50813901047f"
    // }
}
const fetchChats = async (name, email, password, config)=>{
     try {
        const response= await axios.get(`${baseUrl}/`, { name, email, password},config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("error accessChat-- ", error);
        throw new Error("accessChat failed");
    }

    // chatRouter.route("/").get(protect,fetchChats);
}
const createGroupChat = async (name, users, config)=>{
     try {
        const response= await axios.post(`${baseUrl}/group`, { name, users},config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("error accessChat-- ", error);
        throw new Error("accessChat failed");
    }
    // chatRouter.route("/group").post(protect,createGroupChat);
    // {
    // "name":"Group1 rock's",
    // "users":"[\"65aa497e7b0c50813901047f\",\"65aa49b07b0c508139010482\"]"
    // }
}
const renameGroup = async (chatId, chatName, config)=>{
     try {
        const response= await axios.put(`${baseUrl}/rename`, { chatId, chatName},config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("error accessChat-- ", error);
        throw new Error("accessChat failed");
    }
    // chatRouter.route("/rename").put(protect,renameGroup);
    // {
    //   "chatId": "65ab6bdfde87845fc694a08b",
    //   "chatName": "Group1 rock's updated"
    // }
}
const removeFromGroup = async (chatId, userId, config)=>{
     try {
        const response= await axios.put(`${baseUrl}/removeGroup`, { chatId, userId},config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("error accessChat-- ", error);
        throw new Error("accessChat failed");
    }
    // chatRouter.route("/removeGroup").put(protect,removeFromGroup);
    //     {
    // "chatId": "65ab6bdfde87845fc694a08b",
    // "userId": "65aa497e7b0c50813901047f"
    // }
}
const addToGroup = async (chatId, userId, config)=>{
     try {
        const response= await axios.put(`${baseUrl}/groupAdd`, { chatId, userId},config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("error accessChat-- ", error);
        throw new Error("accessChat failed");
    }
    // chatRouter.route("/groupAdd").put(protect,addToGroup);
    //     {
    //   "chatId": "65ab6bdfde87845fc694a08b",
    //   "userId": "65aa497e7b0c50813901047f"
    // }
}

export {registerUser,authUser,accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup};